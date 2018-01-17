const he = require('he')
const url = require('url')
const path = require('path')
const ssr = require('done-ssr')
const through = require('through2')
const feathers = require('feathers')
const wkhtmltopdf = require('wkhtmltopdf')
const filenamify = require('../util/pdf-filename')
const forwardCookies = require('../util/cookies').forwardCookies
const getCssBundlePath = require('../util/get-css-bundle-path')

const fs = require('fs')
const hummus = require('hummus')
const {storage} = require('../pdf/storage')
const {overlayer} = require('../pdf/overlayer')
const {getTemplateOverlay} = require('../../js/author/pdf/assemble')
const paths = require('../util/paths')
const templates = require('../routes/templates')
const files = require('../util/files')
const user = require('../util/user')
const {data} = require('../util/data')

const {
  setDownloadHeaders,
  deleteFile,
  getTemporaryPdfFilepath,
  mergeGuideVariableWithAnswers,
  filterTemplatesByCondition,
  segmentTextAndPdfTemplates,
  getXmlVariables,
  getRequestPdfOptions
} = require('./assemble-utils')

const debug = require('debug')('A2J:assemble')
const router = feathers.Router()

const render = ssr({
  main: 'caja/server.stache!done-autorender',
  config: path.join(__dirname, '..', '..', 'package.json!npm')
})

// config.json is optional for standalone viewer, but defines path to wkhtmltopdf binary
// use linux default if config.json not found
// sample paths: linux '/usr/local/bin/wkhtmltopdf';  windows 'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf';
// TODO: these checks can be removed once config.json is required for all standalone hosting
let config
const configPath = path.join(__dirname, '..', '..', '..', 'config.json')

try {
  fs.accessSync(configPath, fs.constants.R_OK)
  debug('can read config.json from ', configPath)
  config = require('../util/config')
  wkhtmltopdf.command = config.get('WKHTMLTOPDF_PATH')
} catch (err) {
  console.warn('config.json file not found or unaccessible, using linux default path for wkhtmltopdf of : "/usr/local/bin/wkhtmltopdf"')
  debug('expected config.json in ', configPath)
  wkhtmltopdf.command = '/usr/local/bin/wkhtmltopdf'
}

debug('Path to wkhtmltopdf binary: ', wkhtmltopdf.command)

// middleware to validate the presence of either `guideId` or
// `fileDataUrl`, during document assembly one of those two
// properties is needed to retrieve the template's data.
const checkPresenceOf = function (req, res, next) {
  const { guideId, fileDataUrl } = req.body

  if (!guideId && !fileDataUrl) {
    return res.status(400)
      .send('You must provide either guideId or fileDataUrl')
  }

  next()
}

router.post('/', checkPresenceOf, (req, res) => {
  assemble(req, res).catch(error => {
    debug('/assemble error:', error)
    res.status(500).json({
      ok: false,
      error: error.message
    })
  })
})

async function assemble (req, res) {
  debug('Request body:', req.body)
  const pdfOptions = Object.assign(
    getRequestPdfOptions(req),
    {
      'header-spacing': 5,
      'footer-spacing': 5,
      'margin-top': 20
    }
  )

  const cookieHeader = req.headers.cookie
  const {guideId, templateId, answers: answersJson} = req.body
  const htmlOptions = req // Done SSR needs the whole request, sadly
  const downloadName = filenamify('A2J Test Assemble')

  const isSingleTemplateAssemble = !!templateId
  if (isSingleTemplateAssemble) {
    createPdfForTextTemplates(htmlOptions, pdfOptions)
    .then(pdfStream => {
      setDownloadHeaders(res, downloadName)
      pdfStream.pipe(res)
    })
    .catch(error => {
      debug('Single assemble error:', error)
      res.status(500).send(error)
    })
  }

  const username = await user.getCurrentUser({cookieHeader})
  const answers = JSON.parse(answersJson)
  const allTemplates = await getTemplatesForGuide(username, guideId)
  const isTemplateLogical = filterTemplatesByCondition(answers)
  const templates = allTemplates.filter(isTemplateLogical)
  const guideVariables = await getVariablesForGuide(username, guideId)
  const variables = mergeGuideVariableWithAnswers(guideVariables, answers)
  const segments = segmentTextAndPdfTemplates(templates)
  const pdfFiles = await Promise.all(segments.map(
    ({isPdf, templates}) => {
      if (isPdf) {
        return renderPdfForPdfTemplates(username, templates, variables, answers)
      }

      req.body.templateIds = templates.map(t => t.templateId)
      return createPdfForTextTemplates(req, pdfOptions).then(pdfStream => {
        const temporaryPath = getTemporaryPdfFilepath()
        const fileStream = fs.createWriteStream(temporaryPath)
        return new Promise((resolve, reject) => {
          pdfStream.on('error', error => reject(error))
          fileStream.on('finish', () => resolve(temporaryPath))
          fileStream.on('error', error => reject(error))
          pdfStream.pipe(fileStream)
        })
      })
    }
  )).catch(error => {
    debug('Assemble error:', error)
    throw error
  })

  const pdf = await combinePdfFiles(pdfFiles)
  setDownloadHeaders(res, downloadName)
  return new Promise((resolve, reject) => {
    res.sendFile(pdf, error => {
      if (error) {
        debug('Send error:', error)
      }
      deleteFile(pdf)
        .then(resolve)
        .catch(error => {
          debug('Delete error:', error)
          reject(error)
        })
    })
  })
}

async function getTemplatesForGuide (username, guideId) {
  const templateList = await templates.getTemplatesJSON({username})

  const fullTemplates = templateList
    .filter(t => t.guideId === guideId)
    .map(({guideId, templateId}) => paths
      .getTemplatePath({guideId, templateId, username})
      .then(path => files.readJSON({path}))
    )

  const isActive = template =>
    template.active === 'true' || template.active === true

  return Promise.all(fullTemplates)
    .then(templates => templates.filter(isActive))
}

async function getVariablesForGuide (username, guideId) {
  const xml = await data.getGuideXml(username, guideId)
  if (!xml) {
    return {}
  }
  const variables = getXmlVariables(xml)
  return variables.reduce((map, variable) => {
    map[variable.name.toLowerCase()] = variable
    return map
  }, {})
}

async function renderPdfForPdfTemplates (username, templates, variables, answers) {
  const pdfFiles = await Promise.all(templates.map(async template => {
    const filepath = await storage.duplicateTemplatePdf(username, template.templateId)
    const overlay = getTemplateOverlay(template, variables, answers)
    await overlayer.forkWithOverlay(filepath, overlay)
    return filepath
  }))

  return combinePdfFiles(pdfFiles)
}

async function combinePdfFiles (pdfFiles) {
  const [firstPdf, ...otherPdfs] = pdfFiles
  const writer = hummus.createWriterToModify(firstPdf)
  otherPdfs.forEach(pdf => {
    writer.appendPDFPagesFromPDF(pdf)
  })
  writer.end()

  await Promise.all(otherPdfs.map(deleteFile))

  return firstPdf
}

function getHtmlForRichText (options) {
  const request = Object.assign(
    options,
    {__cssBundlePath: getCssBundlePath()}
  )
  const webpageStream = render(request)
  return new Promise((resolve, reject) => {
    webpageStream.pipe(through(buffer => {
      const html = buffer.toString()
      resolve(he.decode(html))
    }))
    webpageStream.on('error', error => reject(error))
  })
}

function getPdfForHtml (html, pdfOptions) {
  return wkhtmltopdf(html, pdfOptions)
}

async function createPdfForTextTemplates (htmlOptions, pdfOptions) {
  const renderedWebpage = await getHtmlForRichText(htmlOptions)
  return getPdfForHtml(renderedWebpage, pdfOptions)
}

router.get('/header-footer', forwardCookies, function (req, res) {
  var query = url.parse(req.originalUrl, true).query

  if (query.page === '1' && query.hideOnFirstPage === 'true') {
    res.status(200).send('<!DOCTYPE html>')
  } else {
    res.status(200).send('<!DOCTYPE html>' + query.content)
  }
})

module.exports = router

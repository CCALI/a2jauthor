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
  getTemporaryPdfFilepath,
  mergeGuideVariableWithAnswers,
  filterTemplatesByCondition,
  segmentTextAndPdfTemplates,
  getXmlVariables,
  getRequestPdfOptions,
  getConfig,
  getConfigPdfOptions,
  setWkhtmltopdfCommand
} = require('./assemble-utils')

const debug = require('debug')('A2J:assemble')
const router = feathers.Router()

const render = ssr({
  main: 'caja/server.stache!done-autorender',
  config: path.join(__dirname, '..', '..', 'package.json!npm')
}, {
  // this allows for debugging in Node --inspect-brk
  // setting a max of 15 seconds before done-ssr times out
  // this does not prevent done-ssr from finishing earlier if
  // the render is complete. see this issue for more details:
  //
  timeout: 15000
})

const config = getConfig()
let configPdfOptions = {}
if (config) {
  setWkhtmltopdfCommand(config)
  configPdfOptions = getConfigPdfOptions(config)
}

const checkPresenceOf = function (req, res, next) {
  const { guideId, fileDataURL } = req.body

  if (!guideId && !fileDataURL) {
    return res.status(400)
      .send('You must provide either guideId or fileDataURL')
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
    configPdfOptions,
    {
      'header-spacing': 5,
      'footer-spacing': 5,
      'margin-top': 20
    }
  )

  const cookieHeader = req.headers.cookie
  let { fileDataURL } = req.body
  const { isTestAssemble, guideTitle, guideId, templateId, answers: answersJson } = req.body
  const htmlOptions = req // Done SSR needs the whole request, sadly
  const downloadName = isTestAssemble ? filenamify(guideTitle + ' test assemble') : filenamify(guideTitle)

  const isSingleTemplateAssemble = !!templateId
  if (isSingleTemplateAssemble) {
    const template = { guideId, templateId }
    return renderPdfForTextTemplates([template], htmlOptions, pdfOptions)
    .then(pdf => {
      setDownloadHeaders(res, downloadName)
      return new Promise((resolve, reject) => {
        res.sendFile(pdf, error => {
          if (error) {
            debug('Single assemble error:', error)
            return reject(error)
          }
          return resolve()
        })
      })
    })
  }

  // if there is no fileDataURL, we are in Author preview and need to build it
  // TODO: this is a middle step until Author, Viewer, and DAT are separate apps
  // and username/guideId will no longer be needed to build paths
  let username = ''
  if (!fileDataURL) {
    username = await user.getCurrentUser({cookieHeader})
    fileDataURL = paths.getGuideDirPath(username, guideId, fileDataURL)
  }

  const answers = JSON.parse(answersJson)
  const allTemplates = await getTemplatesForGuide(username, guideId, fileDataURL)
  const isTemplateLogical = filterTemplatesByCondition(answers)
  const templates = allTemplates.filter(isTemplateLogical)
  const guideVariables = await getVariablesForGuide(username, guideId, fileDataURL)
  const variables = mergeGuideVariableWithAnswers(guideVariables, answers)
  const segments = segmentTextAndPdfTemplates(templates)
  const pdfFiles = await Promise.all(segments.map(
    ({isPdf, templates}) => {
      if (isPdf) {
        return renderPdfForPdfTemplates(username, templates, variables, answers, fileDataURL)
      }

      return renderPdfForTextTemplates(templates, req, pdfOptions, fileDataURL)
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
        return reject(error)
      }
      return resolve()
    })
  })
}

async function getTemplatesForGuide (username, guideId, fileDataURL) {
  const templateIndex = await templates.getTemplatesJSON({username, guideId, fileDataURL})
  // if guideId not defined, we are in standalone viewer/dat assembly using fileDataURL
  // set guideId to the local templates.json value
  if (fileDataURL && !guideId) {
    guideId = templateIndex.guideId
  }
  const templateIds = templateIndex.templateIds
  const templatesPromises = templateIds
  .map(templateId => paths
      .getTemplatePath({guideId, templateId, username, fileDataURL})
      .then(path => files.readJSON({path}))
    )

  const isActive = template =>
    template.active === 'true' || template.active === true

  return Promise.all(templatesPromises)
    .then(templates => templates.filter(isActive))
}

async function getVariablesForGuide (username, guideId, fileDataURL) {
  const xml = await data.getGuideXml(username, guideId, fileDataURL)
  if (!xml) {
    return {}
  }
  const variables = getXmlVariables(xml)
  return variables.reduce((map, variable) => {
    map[variable.name.toLowerCase()] = variable
    return map
  }, {})
}

async function renderPdfForPdfTemplates (username, templates, variables, answers, fileDataURL) {
  const pdfFiles = await Promise.all(templates.map(async template => {
    const filepath = await storage.duplicateTemplatePdf(username, template.guideId, template.templateId, fileDataURL)
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

  return firstPdf
}

async function renderPdfForTextTemplates (templates, req, pdfOptions, fileDataURL) {
  const __cssBundlePath = getCssBundlePath()
  const pdfFiles = await Promise.all(templates.map(template => {
    // make unique request here for each templateId
    const newBody = Object.assign({}, req.body, { templateId: template.templateId, fileDataURL })
    const donessrRequestObject = {
      protocol: req.protocol,
      get: req.get,
      headers: req.headers,
      body: newBody,
      connection: req.connection,
      __cssBundlePath: __cssBundlePath
    }

    return createPdfForTextTemplate(donessrRequestObject, pdfOptions).then(pdfStream => {
      const temporaryPath = getTemporaryPdfFilepath()
      const fileStream = fs.createWriteStream(temporaryPath)
      return new Promise((resolve, reject) => {
        pdfStream.on('error', error => reject(error))
        fileStream.on('finish', () => resolve(temporaryPath))
        fileStream.on('error', error => reject(error))
        pdfStream.pipe(fileStream)
      })
    })
  }))

  return combinePdfFiles(pdfFiles)
}

async function createPdfForTextTemplate (request, pdfOptions) {
  const renderedWebpage = await getHtmlForRichText(request)
  return getPdfForHtml(renderedWebpage, pdfOptions)
}

function getHtmlForRichText (request) {
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

router.get('/header-footer', forwardCookies, function (req, res) {
  var query = url.parse(req.originalUrl, true).query

  if (query.page === '1' && query.hideOnFirstPage === 'true') {
    res.status(200).send('<!DOCTYPE html>')
  } else {
    res.status(200).send('<!DOCTYPE html>' + query.content)
  }
})

module.exports = router

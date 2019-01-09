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
    configPdfOptions,
    {
      'header-spacing': 5,
      'footer-spacing': 5,
      'margin-top': 20
    }
  )

  const cookieHeader = req.headers.cookie
  const {guideId, templateId, answers: answersJson, fileDataUrl} = req.body
  const htmlOptions = req // Done SSR needs the whole request, sadly
  const downloadName = filenamify('A2J Test Assemble')

  const isSingleTemplateAssemble = !!templateId
  if (isSingleTemplateAssemble) {
    return createPdfForTextTemplates(htmlOptions, pdfOptions)
    .then(pdfStream => {
      setDownloadHeaders(res, downloadName)
      pdfStream.pipe(res)
    })
    .catch(error => {
      debug('Single assemble error:', error)
      res.status(500).send(error)
    })
  }

  const username = fileDataUrl ? undefined : await user.getCurrentUser({cookieHeader})
  const answers = JSON.parse(answersJson)
  const allTemplates = await getTemplatesForGuide(username, guideId, fileDataUrl)
  const isTemplateLogical = filterTemplatesByCondition(answers)
  const templates = allTemplates.filter(isTemplateLogical)
  const guideVariables = await getVariablesForGuide(username, guideId, fileDataUrl)
  const variables = mergeGuideVariableWithAnswers(guideVariables, answers)
  const segments = segmentTextAndPdfTemplates(templates)
  const pdfFiles = await Promise.all(segments.map(
    ({isPdf, templates}) => {
      if (isPdf) {
        return renderPdfForPdfTemplates(username, templates, variables, answers, fileDataUrl)
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
        return reject(error)
      }
      return resolve()
    })
  })
}

async function getTemplatesForGuide (username, guideId, fileDataUrl) {
  const templateIndex = await templates.getTemplatesJSON({username, guideId, fileDataUrl})
  // if guideId not defined, we are in standalone viewer/dat assembly using fileDataUrl
  // set guideId to the local templates.json valu
  if (fileDataUrl && !guideId) {
    guideId = templateIndex.guideId
  }
  const templateIds = templateIndex.templateIds
  const templatesPromises = templateIds
  .map(templateId => paths
      .getTemplatePath({guideId, templateId, username, fileDataUrl})
      .then(path => files.readJSON({path}))
    )

  const isActive = template =>
    template.active === 'true' || template.active === true

  return Promise.all(templatesPromises)
    .then(templates => templates.filter(isActive))
}

async function getVariablesForGuide (username, guideId, fileDataUrl) {
  const xml = await data.getGuideXml(username, guideId, fileDataUrl)
  if (!xml) {
    return {}
  }
  const variables = getXmlVariables(xml)
  return variables.reduce((map, variable) => {
    map[variable.name.toLowerCase()] = variable
    return map
  }, {})
}

async function renderPdfForPdfTemplates (username, templates, variables, answers, fileDataUrl) {
  const pdfFiles = await Promise.all(templates.map(async template => {
    const filepath = await storage.duplicateTemplatePdf(username, template.guideId, template.templateId, fileDataUrl)
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

function getHtmlForRichText (options) {
  const request = Object.assign(
    options,
    {__cssBundlePath: getCssBundlePath()}
  )
  const webpageStream = render(request)
  console.log(request.body)
  return new Promise((resolve, reject) => {
    webpageStream.pipe(through(buffer => {
      const html = buffer.toString()
      console.log(html)
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

const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const cheerio = require('cheerio')
const {storage} = require('../pdf/storage')
const debug = require('debug')('A2J:assemble')
const wkhtmltopdf = require('wkhtmltopdf')
const evalAuthorCondition = require('../../js/author/utils/eval-author-condition')

function setDownloadHeaders (res, filename) {
  res.set({
    status: 201,
    'Content-Type': 'application/pdf',
    'Access-Control-Allow-Origin': '*',
    'Content-Disposition': `attachment; filename=${filename}`
  })
}

function deleteFile (filepath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, error => error ? reject(error) : resolve())
  })
}

function getTemporaryPdfFilepath () {
  return path.join(storage.getTemporaryDirectory(), `test-${uuid.v4()}.pdf`)
}

function uniq (list) {
  return list.reduce((list, item) =>
    list.includes(item) ? list : [...list, item]
  , [])
}

function mergeGuideVariableWithAnswers (variables, answers) {
  const allUniqueKeys = uniq([
    ...Object.keys(variables),
    ...Object.keys(answers)
  ])
  return allUniqueKeys.reduce((vars, key) => {
    const union = Object.assign({}, answers[key] || {}, variables[key] || {})
    if (union.name) {
      const {name, type, repeating} = union
      vars[name.toLowerCase()] = {type, repeating, name}
    }
    return vars
  }, {})
}

const isPdfTemplate = template =>
  template.rootNode && template.rootNode.tag === 'a2j-pdf'

function filterTemplatesByCondition (answers) {
  return function (template) {
    if (!isPdfTemplate(template)) {
      return true // Rich text templates do this logic in the SSR side
    }
    const {state} = template.rootNode
    if (!state.hasConditionalLogic) {
      return true
    }
    const shouldBeIncluded = evalAuthorCondition(Object.assign(
      state,
      {answers}
    ))
    return shouldBeIncluded
  }
}

function segmentTextAndPdfTemplates (templates) {
  const [firstTemplate, ...otherTemplates] = templates
  const segments = [{
    isPdf: isPdfTemplate(firstTemplate),
    templates: [firstTemplate]
  }]

  otherTemplates.forEach(template => {
    const isPdf = isPdfTemplate(template)
    const currentSegment = segments[segments.length - 1]
    const shouldAddToSegment = isPdf === currentSegment.isPdf
    if (shouldAddToSegment) {
      currentSegment.templates.push(template)
      return
    }

    segments.push({isPdf, templates: [template]})
  })

  return segments
}

function getXmlVariables (xml) {
  const $ = cheerio.load(xml)
  const answers = []
  $('ANSWERS > ANSWER').each((index, elem) => {
    const attr = attributeName => $(elem).attr(attributeName.toUpperCase())
    const repeating = attr('repeating')
    const answer = {
      name: attr('name'),
      type: attr('type'),
      repeating: repeating === '1' || repeating === 'true',
      comment: attr('comment') || ''
    }
    answers.push(answer)
  })
  return answers
}

function getRequestPdfOptions (req) {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  const headerFooterUrl = url + '/header-footer?content='

  const {
    header,
    hideHeaderOnFirstPage,
    footer,
    hideFooterOnFirstPage
  } = req.body

  const pdfOptions = {}

  if (header) {
    const h = encodeURIComponent(header)
    const hofp = encodeURIComponent(hideHeaderOnFirstPage)

    pdfOptions['header-html'] = `${headerFooterUrl}${h}&hideOnFirstPage=${hofp}`
  }

  if (footer) {
    const f = encodeURIComponent(footer)
    const hofp = encodeURIComponent(hideFooterOnFirstPage)

    pdfOptions['footer-html'] = `${headerFooterUrl}${f}&hideOnFirstPage=${hofp}`
  }

  return pdfOptions
}

function getConfig () {
  let config
  const configPath = path.join(__dirname, '..', '..', '..', 'config.json')
  try {
    fs.accessSync(configPath, fs.constants.R_OK)
    debug('can read config.json from ', configPath)
    config = require('../util/config')
  } catch (err) {
    console.error('config.json file not found or unreadable')
    debug('expected config.json in ', configPath)
  }
  return config
}

function setWkhtmltopdfCommand (config) {
  wkhtmltopdf.command = config.get('WKHTMLTOPDF_PATH')
  debug('Setting path to wkhtmltopdf binary: ', wkhtmltopdf.command)
}

function getConfigPdfOptions (config) {
  const configPdfOptions = {}
  const dpiDefault = 300
  const zoomDefault = 1.0

  configPdfOptions.dpi = parseFloat(config.get('WKHTMLTOPDF_DPI')) || dpiDefault
  configPdfOptions.zoom = parseFloat(config.get('WKHTMLTOPDF_ZOOM')) || zoomDefault

  debug('wkhtmltopdf zoom: ', configPdfOptions.zoom)
  debug('wkhtmltopdf dpi: ', configPdfOptions.dpi)

  return configPdfOptions
}

module.exports = {
  setDownloadHeaders,
  deleteFile,
  getTemporaryPdfFilepath,
  mergeGuideVariableWithAnswers,
  filterTemplatesByCondition,
  segmentTextAndPdfTemplates,
  getXmlVariables,
  getRequestPdfOptions,
  getConfig,
  getConfigPdfOptions,
  setWkhtmltopdfCommand
}

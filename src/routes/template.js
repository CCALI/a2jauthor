const _ = require('lodash')
const Q = require('q')
const paths = require('../util/paths')
const files = require('../util/files')
const user = require('../util/user')
const templates = require('./templates')

const debug = require('debug')('A2J:routes/template')

/**
 * @module {Module} /routes/template template
 * @parent api
 *
 * Module containing methods for handling /template route
 * and helper functions.
 *
 * ## Use
 * @codestart
 * var template = require('routes/template');
 * var app = feathers();
 * app.use('/api/template', template);
 * @codeend
 *
 */
module.exports = {
  /**
   * @property {Function} templates.summaryFields
   * @parent templates
   *
   * Fields from template to be included in summary templates.json file.
   *
   */
  summaryFields: [
    'guideId',
    'templateId'
  ],
  /**
   * @property {Function} templates.filterTemplatesByTemplateId
   * @parent templates
   *
   * Filter an array of templates to find the one with matching
   * templateId.
   *
   * @param {Array} templatesData
   * @param {Number} templateId
   * @return {Object} template from templates array matching templateId
   */
  filterTemplatesByTemplateId ({ templatesData, templateId }) {
    const template = _.find(templatesData, (o) => o.templateId === parseInt(templateId, 10))

    if (!template) {
      throw new Error('Template not found with templateId ' + templateId)
    }

    return template
  },

  /**
   * @property {Function} templates.getNextTemplateId
   * @parent templates
   *
   * Get the next valid template id by adding 1 to the
   * highest existing templateId.
   *
   * @param {Array} templateIds - list of existing templateIds.
   * @return {Number} next valid templateId.
   */
  getNextTemplateId ({ templateIds }) {
    const maxId = _.max(templateIds) || 0
    return maxId + 1
  },

  /**
   * @property {Function} templates.successHandler
   * @parent templates
   *
   * Common handler for API successes.
   *
   * @param {String} msg - debug message.
   * @param {Object} data - response data.
   * @param {Function} callback - API callback.
   */
  successHandler ({ msg, data, callback }) {
    debug(msg)
    callback(null, data)
  },

  /**
   * @property {Function} templates.successHandler
   * @parent templates
   *
   * Common handler for API failures.
   *
   * @param {String} error - error message.
   * @param {Function} callback - API callback.
   */
  errorHandler ({ error, callback }) {
    debug(error)
    callback(error)
  },

  /**
   * @property {Function} template.get
   * @parent templates
   *
   * Get a templates by id.
   *
   * ## Use
   *
   * GET /api/template/{guideId}-{template_id}
   */
  get (comboId, params, callback) {
    debug(`GET /api/template/${comboId} request`)

    const [ guideId, templateId ] = comboId.split('-')
    const { fileDataUrl } = params.query || ''
    const usernamePromise = user.getCurrentUser({ cookieHeader: params.cookieHeader })

    usernamePromise
      .then(username => paths.getTemplatePath({
        username,
        guideId,
        templateId,
        fileDataUrl
      }))
      .then(templatePath => files.readJSON({ path: templatePath }))
      .then(data => this.successHandler({
        msg: `GET /api/template/${templateId} response: ${JSON.stringify(data)}`,
        data,
        callback
      }))
      .catch(error => this.errorHandler({ error, callback }))
  },

  /**
   * @property {Function} template.create
   * @parent templates
   *
   * Create a new template.
   *
   * Write a template file and update the templates.json
   * file with the new template data.
   *
   * ## Use
   *
   * POST /api/template
   */
  create (data, params, callback) {
    debug(`POST /api/template request: ${JSON.stringify(data)}`)

    const currentTime = Date.now()
    const usernamePromise = user.getCurrentUser({ cookieHeader: params.cookieHeader })
    // get templates.json index file, get next templateId, assign new templateId to created template
    const templateDataPromise = usernamePromise
      .then(username => templates.getTemplatesJSON({
        username,
        guideId: data.guideId
      }))
      .then(templatesData => this.getNextTemplateId({ templateIds: templatesData.templateIds }))
      .then(templateId => _.assign(data, {
        templateId,
        createdAt: currentTime,
        updatedAt: currentTime
      }))
    // get path for new template, and write it's json to the file system
    const writeTemplatePromise = Q.all([templateDataPromise, usernamePromise])
      .then(([{ guideId, templateId }, username]) => paths.getTemplatePath({
        guideId,
        templateId,
        username
      }))
      .then(path => files.writeJSON({ path, data }))
    // get templates.json index file and update it's templateIds array with new templateId number
    const templatesPathPromise = usernamePromise
      .then(username => paths.getTemplatesPath({
        username,
        guideId: data.guideId
      }))

    const writeSummaryPromise = Q.all([templatesPathPromise, templateDataPromise])
      .then(([ path, templateData ]) => files.mergeJSON({
        path,
        data: _.pick(templateData, this.summaryFields)
      }))

    Q.all([
      writeTemplatePromise,
      writeSummaryPromise
    ]).then(([data]) => this.successHandler({
      msg: `POST /api/template response: ${JSON.stringify(data)}`,
      data,
      callback
    }))
      .catch(error => this.errorHandler({ error, callback }))
  },

  /**
   * @property {Function} template.update
   * @parent templates
   *
   * Update a template file and update the templates.json
   * file with the new template data.
   *
   * ## Use
   *
   * PUT /api/template/{template_id}
   */
  update (comboId, data, params, callback) {
    debug(`PUT /api/template/${comboId} request: ${JSON.stringify(data)}`)

    const [ guideId, templateId ] = comboId.split('-')
    const currentTime = Date.now()
    _.assign(data, {
      guideId: guideId,
      templateId: +templateId,
      updatedAt: currentTime
    })

    const usernamePromise = user.getCurrentUser({ cookieHeader: params.cookieHeader })

    const writeTemplatePromise = usernamePromise
      .then(username => paths.getTemplatePath({
        guideId,
        templateId,
        username
      }))
      .then(path => files.writeJSON({ path, data }))

    Q.all([
      writeTemplatePromise
    ]).then(([data]) => this.successHandler({
      msg: `PUT /api/template/${comboId} response: ${JSON.stringify(data)}`,
      data,
      callback
    }))
      .catch(error => this.errorHandler({ error, callback }))
  }
}

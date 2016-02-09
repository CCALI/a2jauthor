var _ = require('lodash');
var Q = require('q');
var path = require('path');
var paths = require('../util/paths');
var files = require('../util/files');
var user = require('../util/user');
var templates = require('./templates');

var debug = require('debug')('A2J:routes/template');

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
  filterTemplatesByTemplateId({ templatesData, templateId }) {
    var template = _.find(templatesData, (o) => o.templateId === parseInt(templateId, 10));

    if (!template) {
      throw new Error('Template not found with templateId ' + templateId);
    }

    return template;
  },

  /**
   * @property {Function} templates.getNextTemplateId
   * @parent templates
   *
   * Get the next valid template id by adding 1 to the
   * highest existing templateId.
   *
   * @param {Array} templates - list of existing templates.
   * @return {Number} next valid templateId.
   */
  getNextTemplateId({ templatesData }) {
    let maxId = _.max(_.map(templatesData, template => template.templateId)) || 0;
    return maxId + 1;
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
  successHandler({ msg, data, callback }) {
    debug(msg);
    callback(null, data);
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
  errorHandler({ error, callback }) {
    debug(error);
    callback(error);
  },

  /**
   * @property {Function} template.get
   * @parent templates
   *
   * Get a templates by id.
   *
   * ## Use
   *
   * GET /api/template/{template_id}
   */
  get(templateId, params, callback) {
    debug(`GET /api/template/${templateId} request`);

    let usernamePromise = user.getCurrentUser({ cookieHeader: params.cookieHeader });

    let templateSummaryPromise = usernamePromise
      .then(username => templates.getTemplatesJSON({ username }))
      .then(templatesData => this.filterTemplatesByTemplateId({ templatesData, templateId }));

    Q.all([templateSummaryPromise, usernamePromise])
      .then(([{ guideId, templateId }, username]) => paths.getTemplatePath({
        guideId,
        templateId,
        username
      }))
      .then(templatePath => files.readJSON({ path: templatePath }))
      .then(data => this.successHandler({
        msg: `GET /api/template/${templateId} response: ${JSON.stringify(data)}`,
        data,
        callback
      }))
      .catch(error => this.errorHandler({ error, callback }));
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
  create(data, params, callback) {
    debug(`POST /api/template request: ${JSON.stringify(data)}`);

    let currentTime = Date.now();
    let usernamePromise = user.getCurrentUser({ cookieHeader: params.cookieHeader });

    let templateDataPromise = usernamePromise
      .then(username => templates.getTemplatesJSON({ username }))
      .then(templatesData => this.getNextTemplateId({ templatesData }))
      .then(templateId => _.assign(data, {
        templateId,
        createdAt: currentTime,
        updatedAt: currentTime
      }));

    let writeTemplatePromise = Q.all([templateDataPromise, usernamePromise])
      .then(([{ guideId, templateId }, username]) => paths.getTemplatePath({
        guideId,
        templateId,
        username
      }))
      .then(path => files.writeJSON({ path, data }));

    let templatesPathPromise = usernamePromise
      .then(username => paths.getTemplatesPath({ username }));

    let writeSummaryPromise = Q.all([ templatesPathPromise, templateDataPromise])
      .then(([ path, templateData ]) => files.mergeJSON({
        path,
        data: _.pick(templateData, this.summaryFields)
      }));

    return Q.all([
      writeTemplatePromise,
      writeSummaryPromise
    ]).then(([data]) => this.successHandler({
        msg: `POST /api/template response: ${JSON.stringify(data)}`,
        data,
        callback
      }))
      .catch(error => this.errorHandler({ error, callback }));
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
  update(templateId, data, params, callback) {
    debug(`PUT /api/template/${templateId} request: ${JSON.stringify(data)}`);

    let currentTime = Date.now();
    _.assign(data, {
      templateId: +templateId,
      updatedAt: currentTime
    });

    let usernamePromise = user.getCurrentUser({ cookieHeader: params.cookieHeader });

    let writeTemplatePromise = usernamePromise
      .then(username => paths.getTemplatePath({
        guideId: data.guideId,
        templateId: data.templateId,
        username
      }))
      .then(path => files.writeJSON({ path, data }));

    let writeSummaryPromise = usernamePromise
      .then(username => paths.getTemplatesPath({ username }))
      .then(path => files.mergeJSON({
        path,
        data: _.pick(data, this.summaryFields),
        replaceKey: 'templateId'
      }))

    Q.all([
        writeTemplatePromise,
        writeSummaryPromise
      ]).then(([data]) => this.successHandler({
        msg: `PUT /api/template/${templateId} response: ${JSON.stringify(data)}`,
        data,
        callback
      }))
      .catch(error => this.errorHandler({ error, callback }));
  }
};

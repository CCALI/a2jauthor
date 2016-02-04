var _ = require('lodash');
var Q = require('q');
var path = require('path');
var paths = require('../util/paths');
var files = require('../util/files');
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
    'templateId',
    'updatedAt',
    'title',
    'active'
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
   * @property {Function} templates.writeTemplateAndUpdateSummary
   * @parent templates
   *
   * Write a template file and update the templates.json
   * file with the new template data.
   *
   * @param {String} path - template path.
   * @param {Object} data - template data.
   * @param {Boolean} replaceOnMerge - whether to replace the template's
   * summary when merging into the templates.json file.
   * @return {Promise} resolves when both files are written.
   */
  writeTemplateAndUpdateSummary({ path, data, replaceOnMerge }) {
    var summaryData = _.pick(data, this.summaryFields);
    var uniqueId = replaceOnMerge ? 'templateId' : undefined;

    var writeTemplatePromise = files.writeJSON({ path, data });

    var templatesPathPromise = paths.getTemplatesPath();

    var writeSummaryPromise = templatesPathPromise
      .then(path => files.mergeJSON({ path, data: summaryData, replaceKey: uniqueId }));

    return Q.all([
      writeTemplatePromise,
      writeSummaryPromise
    ]).then(([templateData, summaryData]) => templateData);
  },

  /**
   * @property {Function} templates.deleteTemplateAndUpdateSummary
   * @parent templates
   *
   * Delete a template file and update the templates.json
   * to remove its entry.
   *
   * @param {String} id - template id.
   * @return {Promise} resolves when file is deleted and templates.json
   * is updated.
   */
  deleteTemplateAndUpdateSummary({ templateId }) {
    var templatesPathPromise = paths.getTemplatesPath();

    var templateDataPromise = templatesPathPromise
      .then(templatesPath => files.readJSON({ path: templatesPath }))
      .then(templatesData => this.filterTemplatesByTemplateId({ templatesData, templateId }));

    var deletePromise = templateDataPromise
      .then(templateSummary => paths.getTemplatePath(templateSummary))
      .then(templatePath => files.delete({ path: templatePath }));

    var updatePromise = Q.all([
      templatesPathPromise,
      templateDataPromise
    ]).then(([path, data]) => {
      debug("DATA", data);
      return files.spliceJSON({ path, data })
    });

    return Q.all([
      deletePromise,
      updatePromise
    ]).then(([templatePath, summaryData]) => templatePath);
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

    templates.getTemplatesJSON()
      .then(templatesData => this.filterTemplatesByTemplateId({ templatesData, templateId }))
      .then(templateSummary => paths.getTemplatePath(templateSummary))
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
   * ## Use
   *
   * POST /api/template
   */
  create(data, params, callback) {
    debug(`POST /api/template request: ${JSON.stringify(data)}`);

    templates.getTemplatesJSON()
      .then(templatesData => this.getNextTemplateId({ templatesData }))
      .then(templateId => _.assign(data, { templateId: templateId }))
      .then(newTemplateData => paths.getTemplatePath(newTemplateData))
      .then(newTemplatePath => this.writeTemplateAndUpdateSummary({ path: newTemplatePath, data }))
      .then(data => this.successHandler({
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
   * Update a template.
   *
   * ## Use
   *
   * PUT /api/template/{template_id}
   */
  update(templateId, data, params, callback) {
    debug(`PUT /api/template/${templateId} request: ${JSON.stringify(data)}`);

    _.assign(data, { templateId: +templateId });

    paths.getTemplatesPath()
      .then(templatesPath => files.readJSON({ path: templatesPath }))
      .then(templatesData => this.filterTemplatesByTemplateId({ templatesData, templateId }))
      .then(templateSummary => paths.getTemplatePath(templateSummary))
      .then(templatePath => this.writeTemplateAndUpdateSummary({ path: templatePath, data, replaceOnMerge: true }))
      .then(data => this.successHandler({
        msg: `PUT /api/template/${templateId} response: ${JSON.stringify(data)}`,
        data,
        callback
      }))
      .catch(error => this.errorHandler({ error, callback }));
  },

  /**
   * @property {Function} template.delete
   * @parent templates
   *
   * Delete a template.
   *
   * ## Use
   *
   * DELETE /api/template/{template_id}
   */
  remove(templateId, params, callback) {
    debug(`DELETE /api/template/${templateId} request`);

    this.deleteTemplateAndUpdateSummary({ templateId })
      .then(data => this.successHandler({
        msg: `DELETE /api/template/${templateId} response: ${data}`,
        data: templateId,
        callback
      }))
      .catch(error => this.errorHandler({ error, callback }));
  }
};

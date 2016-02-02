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
   * @property {Function} templates.filterTemplatesByTemplateId
   * @parent templates
   *
   * Filter an array of templates to find the one with matching
   * templateId.
   *
   * @param {Array} templates
   * @param {Number} templateId
   * @return {Object} template from templates array matching templateId
   */
  filterTemplatesByTemplateId(templates, templateId) {
    var template = _.find(templates, (o) => {
      return o.templateId === parseInt(templateId, 10);
    });

    if (!template) {
      throw new Error('Template not found with templateId ' + templateId);
    }

    return template;
  },

  /**
   * @property {Function} templates.getTemplatePath
   * @parent templates
   *
   * Get a path to a template based on its summary.
   *
   * @param {Object} template - an object summarizing a template.
   * @return {String} path to the template's file.
   */
  getTemplatePath({ guideId, templateId }) {
    return paths.getTemplatePath(guideId, templateId);
  },

  /**
   * @property {Function} templates.getTemplatePath
   * @parent templates
   *
   * Get the next valid template id by adding 1 to the
   * highest existing templateId.
   *
   * @param {Array} templates - list of existing templates.
   * @return {Number} next valid templateId.
   */
  getNextTemplateId(templates) {
    let maxId = _.max(_.map(templates, file => file.templateId)) || 0;
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
  writeTemplateAndUpdateSummary(path, data, replaceOnMerge) {
    var summaryData = _.pick(data, [
      'guideId',
      'templateId',
      'updatedAt',
      'title'
    ]);
    var uniqueId = replaceOnMerge ? 'templateId' : undefined;

    var writeTemplatePromise = files.writeJSON(path, data);

    var templatesPathPromise = paths.getTemplatesPath();

    var writeSummaryPromise = templatesPathPromise
      .then(path => files.mergeJSON(path, summaryData, uniqueId));

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
  deleteTemplateAndUpdateSummary(id) {
    var templatesPathPromise = paths.getTemplatesPath();

    var templateDataPromise = templatesPathPromise
      .then(templatesPath => files.readJSON(templatesPath))
      .then(templatesData => this.filterTemplatesByTemplateId(templatesData, id));

    var deletePromise = templateDataPromise
      .then(templateSummary => this.getTemplatePath(templateSummary))
      .then(templatePath => files.delete(templatePath));

    var updatePromise = Q.all([
      templatesPathPromise,
      templateDataPromise
    ]).then(([path, data]) => files.spliceJSON(path, data));

    return Q.all([
      deletePromise,
      updatePromise
    ]);
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
  successHandler(msg, data, callback) {
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
  errorHandler(error, callback) {
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
  get(templateId, params, cb) {
    debug('GET /api/template/' + templateId);

    templates.getTemplatesJSON()
      .then(templatesData => this.filterTemplatesByTemplateId(templatesData, templateId))
      .then(templateSummary => this.getTemplatePath(templateSummary))
      .then(templatePath => files.readJSON(templatePath))
      .then(templateData => this.successHandler(`Found template ${templateData}`, templateData, cb))
      .catch(error => this.errorHandler(error, cb));
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
  create(data, params, cb) {
    debug('POST /api/template', JSON.stringify(data));

    templates.getTemplatesJSON()
      .then(templatesData => this.getNextTemplateId(templatesData))
      .then(templateId => _.assign(data, { templateId: templateId }))
      .then(newTemplateData => this.getTemplatePath(newTemplateData))
      .then(newTemplatePath => this.writeTemplateAndUpdateSummary(newTemplatePath, data))
      .then(templateData => this.successHandler(`Wrote template ${templateData.templateId}`, templateData, cb))
      .catch(error => this.errorHandler(error, cb));
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
  update(id, data, params, cb) {
    debug('PUT /api/template/' + id, data);

    paths.getTemplatesPath()
      .then(templatesPath => files.readJSON(templatesPath))
      .then(templatesData => this.filterTemplatesByTemplateId(templatesData, id))
      .then(templateSummary => this.getTemplatePath(templateSummary))
      .then(templatePath => this.writeTemplateAndUpdateSummary(templatePath, data, true))
      .then(templateData => this.successHandler(`Updated template ${id} with ${templateData}`, templateData, cb))
      .catch(error => this.errorHandler(error, cb));
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
  remove(id, params, cb) {
    debug('DELETE /api/template/' + id);

    this.deleteTemplateAndUpdateSummary(id)
      .then(templatePath => this.successHandler(`Deleted template ${templatePath}`, templatePath, cb))
      .catch(error => this.errorHandler(error, cb));
  }
};

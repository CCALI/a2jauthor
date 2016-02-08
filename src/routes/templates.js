var Q = require('q');
var _ = require('lodash');
var paths = require('../util/paths');
var files = require('../util/files');
var user = require('../util/user');
var debug = require('debug')('A2J:routes/templates');

/**
 * @module {Module} /routes/templates templates
 * @parent api
 *
 * Module containing methods for handling /templates route
 * and helper functions.
 *
 * ## Use
 * @codestart
 * var templates = require('routes/templates');
 * var app = feathers();
 * app.use('/api/templates', templates);
 * @codeend
 *
 */
module.exports = {
  /**
   * @property {Function} templates.getTemplatesPath
   * @parent templates
   *
   * Read the templates.json file. If it does not exist,
   * create it with an empty array.
   *
   * @return {Promise} a Promise that will resolve to the
   * path to templates data.
   */
  getTemplatesJSON({ username }) {
    let templatesJSONPath;

    return paths.getTemplatesPath({ username })
      .then(templatesPath => {
        templatesJSONPath = templatesPath;
        return files.readJSON({ path: templatesPath });
      })
      .catch(err => {
        debug(err);
        debug(`Writing ${templatesJSONPath}`);
        return files.writeJSON({ path: templatesJSONPath, data: [] });
      });
  },

  /**
   * @property {Function} templates.get
   * @parent templates
   *
   * Get all templates associated with a guideId.
   *
   * Filters the templates.json file to a list of templates that match the guideId.
   * Then uses the guideId and templateId from this list to open each individual
   * template file and combine the data.
   *
   * ## Use
   *
   * GET /api/templates/{guide_id}
   */
  get(guideId, params, callback) {
    debug('GET /api/templates/' + guideId);

    let usernamePromise = user.getCurrentUser({ cookieHeader: params.cookieHeader });

    let filteredTemplateSummaries = usernamePromise
      .then(username => this.getTemplatesJSON({ username }))
      .then(templateSummaryData => _.filter(templateSummaryData, o => o.guideId === guideId));

    let templatePromises = Q.all([filteredTemplateSummaries, usernamePromise])
      .then(([ filteredTemplates, username ]) => {
        return _.map(filteredTemplates, ({ guideId, templateId }) => {
          return paths.getTemplatePath({
            guideId,
            templateId,
            username
          }).then(path => {
            return files.readJSON({ path });
          });
        });
      });

    Q.all(templatePromises)
      .then(templates => {
        if (templates.length) {
          debug('Found', templates.length, 'templates for guide', guideId);
        } else {
          debug('No templates found for guideId ' + guideId);
        }
        callback(null, templates);
      })
      .catch(error => {
        debug(error);
        callback(error);
      });
  }
};

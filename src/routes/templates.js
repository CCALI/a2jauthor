const Q = require('q');
const _ = require('lodash');
const paths = require('../util/paths');
const files = require('../util/files');
const user = require('../util/user');
const debug = require('debug')('A2J:routes/templates');

const filterTemplatesByActive = function(active, templates) {
  return (active != null) ? _.filter(templates, { active }) : templates;
};

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

    const pathPromise = paths
      .getTemplatesPath({ username })
      .then(templatesPath => {
        templatesJSONPath = templatesPath;
        return templatesPath;
      });

    return pathPromise
      .then(path => files.readJSON({ path }))
      .catch(err => {
        debug(err);
        debug(`Writing ${templatesJSONPath}`);
        return files.writeJSON({ path: templatesJSONPath, data: [] });
      });
  },

  /**
   * @property {Function} templates.find
   * @parent templates
   *
   * Find all templates in `fileDataUrl`
   *
   * Reads the templates.json file in `fileDataUrl`, then uses the templateId
   * from this list to open each individual template file, filters them based
   * on the `active` param (if available) and then send back the combined data.
   *
   * ## Use
   *
   * GET /api/templates?fileDataUrl="path/to/data/folder"&active=true
   * GET /api/templates?fileDataUrl="path/to/data/folder"&active=false
   */
  find(params, callback) {
    const { active, fileDataUrl } = (params.query || {});

    if (!fileDataUrl) {
      return callback('You must provide fileDataUrl');
    }

    const templateIndexPromise = paths
      .getTemplatesPath({ fileDataUrl })
      .then(path => files.readJSON({ path }));

    const templatePromises = templateIndexPromise
      .then(templateIndex => {
        return _.map(templateIndex, ({ templateId }) => {
          return paths
            .getTemplatePath({ templateId, fileDataUrl })
            .then(path => files.readJSON({ path }));
        });
      });

    Q.all(templatePromises)
      .then(templates => filterTemplatesByActive(active, templates))
      .then(filteredTemplates => callback(null, filteredTemplates))
      .catch(error => {
        debug(error);
        callback(error);
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
   * GET /api/templates/{guide_id}?active=true
   * GET /api/templates/{guide_id}?active=false
   */
  get(guideId, params, callback) {
    debug('GET /api/templates/' + guideId);

    const { cookieHeader } = params;
    const { active } = (params.query || {});
    const usernamePromise = user.getCurrentUser({ cookieHeader });

    const filterByGuideId = function(coll) {
      return _.filter(coll, o => o.guideId === guideId);
    };

    const filteredTemplateSummaries = usernamePromise
      .then(username => this.getTemplatesJSON({ username }))
      .then(filterByGuideId);

    const templatePromises = Q
      .all([filteredTemplateSummaries, usernamePromise])
      .then(([ filteredTemplates, username ]) => {
        return _.map(filteredTemplates, ({ guideId, templateId }) => {
          const pathPromise = paths.getTemplatePath({
            guideId, templateId, username
          });

          return pathPromise.then(path => {
            return files.readJSON({ path });
          });
        });
      });

    const debugTemplatesByGuide = function(templates) {
      if (templates.length) {
        debug('Found', templates.length, 'templates for guide', guideId);
      } else {
        debug('No templates found for guideId ' + guideId);
      }
    };

    Q.all(templatePromises)
      .then(templates => filterTemplatesByActive(active, templates))
      .then(filteredTemplates => {
        debugTemplatesByGuide(filteredTemplates);
        callback(null, filteredTemplates);
      })
      .catch(error => {
        debug(error);
        callback(error);
      });
  }
};

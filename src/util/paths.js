const Q = require('q');
const path = require('path');
const config = require('./config');

/**
 * @module {Module} /util/paths paths
 * @parent api
 *
 * Module containing utility functions for working
 * with file paths.
 *
 */
module.exports = {
  /**
   * @property {Function} paths.getTemplatesPath
   * @parent paths
   *
   * @return {Promise} a Promise that will resolve to the
   * path to the templates.json file  for the current user.
   */
  getTemplatesPath({ username }) {
    const deferred = Q.defer();

    const guidesDir = config.get('GUIDES_DIR');
    const file = path.join(guidesDir, username, 'templates.json');

    deferred.resolve(file);

    return deferred.promise;
  },

  /**
   * @property {Function} paths.getTemplatePath
   * @parent paths
   *
   * @param {String} guideId - id of the guide.
   * @param {String} templateId - id of the template.
   * @return {Promise} a Promise that will resolve to the
   * path to the JSON file of a template.
   */
  getTemplatePath({ username, guideId, templateId }) {
    const deferred = Q.defer();
    const guidesDir = config.get('GUIDES_DIR');

    const file = path.join(
      guidesDir, username,
      `guides/Guide${guideId}`,
      `template${templateId}.json`
    );

    deferred.resolve(file);

    return deferred.promise;
  }
};

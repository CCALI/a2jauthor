var path = require('path');
var user = require('./user');
var Q = require('q');
var debug = require('debug')('A2J:paths')

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
   * @property {Function} paths.guidesDir
   * @parent paths
   *
   * Path of the userfiles directory.
   */
   guidesDir: path.join(process.cwd(), '../userfiles/'),

  /**
   * @property {Function} paths.getTemplatesPath
   * @parent paths
   *
   * @return {Promise} a Promise that will resolve to the
   * path to the templates.json file  for the current user.
   */
  getTemplatesPath() {
    var deferred = Q.defer();

    user.getCurrentUser()
      .then(user => {
        let file = path.join(this.guidesDir,
                     user,
                     'templates.json');

        deferred.resolve(file);
      });

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
  getTemplatePath({ guideId, templateId }) {
    var deferred = Q.defer();

    user.getCurrentUser()
      .then(user => {
        let file = path.join(this.guidesDir,
                    user,
                    'guides',
                    '' + guideId,
                    'template' + templateId + '.json');

        deferred.resolve(file);
      });

    return deferred.promise;
  }
};

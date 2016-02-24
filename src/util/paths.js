const Q = require('q');
const path = require('path');
const config = require('./config');
const urlRegex = require('url-regex');

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
   * @function paths.getViewerPath
   * @parent paths
   * @return {String} Absolute path to the viewer app folder
   */
  getViewerPath() {
    return path.join(__dirname, '..', '..', 'js/viewer');
  },

  /**
   * @function paths.normalizeFileDataUrl
   * @parent paths
   * @param {String} fileDataUrl URL where the file data folder is located
   *
   * When `fileDataUrl` is used to locate the template(s) json files,
   * we need to build the templates path using the viewer folder as
   * the base if `fileDataUrl` is relative, otherwise we just use the
   * absolute `fileDataUrl` as-is.
   *
   * @return {String} Normalized file data url
   */
  normalizeFileDataUrl(fileDataUrl) {
    const isAbsolutePath = path.isAbsolute(fileDataUrl);
    const isUrl = urlRegex({ exact: true }).test(fileDataUrl);

    return (isUrl || isAbsolutePath) ?
      fileDataUrl :
      path.join(this.getViewerPath(), fileDataUrl);
  },

  /**
   * @property {Function} paths.getTemplatesPath
   * @parent paths
   *
   * @return {Promise} a Promise that will resolve to the
   * path to the templates.json file for the current user.
   */
  getTemplatesPath({ username, fileDataUrl }) {
    const deferred = Q.defer();
    const guidesDir = config.get('GUIDES_DIR');

    const file = fileDataUrl ?
      path.join(this.normalizeFileDataUrl(fileDataUrl), 'templates.json') :
      path.join(guidesDir, username, 'templates.json');

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
  getTemplatePath({ username, guideId, templateId, fileDataUrl }) {
    const deferred = Q.defer();
    const guidesDir = config.get('GUIDES_DIR');
    const folderName = `guides/Guide${guideId}`;
    const filename = `template${templateId}.json`;

    const file = fileDataUrl ?
      path.join(this.normalizeFileDataUrl(fileDataUrl), filename) :
      path.join(guidesDir, username, folderName, filename);

    deferred.resolve(file);

    return deferred.promise;
  }
};

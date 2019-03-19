const Q = require('q')
const path = require('path')
const config = require('./config')
const urlRegex = require('url-regex')

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
   *
   *  if the config value exists, most likely a standalone viewer/dat install
   *  if not use the default A2J Author location
   */
  getViewerPath () {
    const viewerConfigPath = config.get('VIEWER_PATH')
    return viewerConfigPath || path.join(__dirname, '..', '..', 'js/viewer')
  },

  /**
   * @function paths.normalizeFileDataUrl
   * @parent paths
   * @param {String} fileDataURL URL where the file data folder is located
   *
   * When `fileDataURL` is used to locate the template(s) json files,
   * we need to build the templates path using the viewer folder as
   * the base if `fileDataURL` is relative, otherwise we just use the
   * absolute `fileDataURL` as-is.
   *
   * @return {String} Normalized file data url
   */
  normalizeFileDataUrl (fileDataURL) {
    const isAbsolutePath = path.isAbsolute(fileDataURL)
    const isUrl = urlRegex({ exact: true }).test(fileDataURL)

    return (isUrl || isAbsolutePath)
    ? fileDataURL
    : path.join(this.getViewerPath(), fileDataURL)
  },

  /**
   * @function paths.getGuideDirPath
   * @parent paths
   * @param {String} username - current username.
   * @param {String} guideId - id of the guide.
   * @param {String} fileDataURL - used for standalone assembly
   *
   * When `fileDataURL` is used to locate the root Guide directory,
   * we need to build the Guide path using the viewer folder as
   * the base if `fileDataURL` is relative, otherwise we just use the
   * absolute `fileDataURL` as-is.
   *
   * @return {String} Normalized file data url
   */
  getGuideDirPath (username, guideId, fileDataURL) {
    const guidesDir = config.get('GUIDES_DIR')

    return fileDataURL
    ? path.join(this.normalizeFileDataUrl(fileDataURL))
    : path.join(guidesDir, username, 'guides', `Guide${guideId}`)
  },

  /**
   * @property {Function} paths.getTemplatesPath
   * @parent paths
   * @param {String} username - current username.
   * @param {String} guideId - id of the guide.
   * @param {String} fileDataURL - used for standalone assembly
   *
   * @return {Promise} a Promise that will resolve to the
   * path to the templates.json file for the current Interview.
   */
  getTemplatesPath ({ username, guideId, fileDataURL }) {
    const deferred = Q.defer()
    const guidesDir = config.get('GUIDES_DIR')

    const templatesPath = fileDataURL
      ? path.join(this.normalizeFileDataUrl(fileDataURL), 'templates.json')
      : path.join(guidesDir, username, 'guides', `Guide${guideId}`, 'templates.json')

    deferred.resolve(templatesPath)

    return deferred.promise
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
  getTemplatePath ({ username, guideId, templateId, fileDataURL }) {
    const deferred = Q.defer()
    const guidesDir = config.get('GUIDES_DIR')
    const folderName = `guides/Guide${guideId}`
    const filename = `template${templateId}.json`

    const file = fileDataURL
      ? path.join(this.normalizeFileDataUrl(fileDataURL), filename)
      : path.join(guidesDir, username, folderName, filename)

    deferred.resolve(file)

    return deferred.promise
  }
}

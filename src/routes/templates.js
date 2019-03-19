const Q = require('q')
const _ = require('lodash')
const paths = require('../util/paths')
const files = require('../util/files')
const user = require('../util/user')
const debug = require('debug')('A2J:routes/templates')

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
   * @property {Function} templates.getTemplatesJSON
   * @parent templates
   *
   * Read the templates.json file.
   *
   * @return {Promise} a Promise that will resolve to the templates.json data.
   */
  getTemplatesJSON ({ username, guideId, fileDataURL }) {
    return paths.getTemplatesPath({ username, guideId, fileDataURL })
      .then(path => files.readJSON({ path }))
      .catch((err, path) => {
        debug('reading templates.json from this path failed', path)
        console.error(err)
      })
  },

  /**
   * @property {Function} templates.find
   * @parent templates
   *
   * Find all templates in `fileDataURL`
   *
   * Reads the templates.json file in `fileDataURL`, then uses the templateId
   * from this list to open an individual template file
   *
   * ## Use
   *
   * GET /api/templates?fileDataURL="path/to/data/folder"
   */
  find (params, callback) {
    const { fileDataURL } = (params.query || {})

    if (!fileDataURL) {
      return callback(new Error('You must provide fileDataURL'))
    }

    const templateIndexPromise = paths
      .getTemplatesPath({ fileDataURL })
      .then(path => files.readJSON({ path }))

    const templatePromises = templateIndexPromise
      .then(templateIndex => {
        const templateIds = templateIndex.templateIds
        return _.map(templateIds, (templateId) => {
          return paths
            .getTemplatePath({ username: null, guideId: null, templateId, fileDataURL })
            .then(path => files.readJSON({ path }))
        })
      })

    Q.all(templatePromises)
      .then(templates => callback(null, templates))
      .catch(error => {
        debug(error)
        callback(error)
      })
  },

  /**
   * @property {Function} templates.get
   * @parent templates
   *
   * Get all templates associated with a guideId.
   *
   * ## Use
   *
   * GET /api/templates/{guide_id}
   */
  get (guideId, params, callback) {
    debug('GET /api/templates/' + guideId)

    const { cookieHeader } = params
    // fileDataURL is coming in as the string 'undefined'
    const { fileDataURL } = (params.query || '')
    const usernamePromise = user.getCurrentUser({ cookieHeader })

    let username

    const templatePathPromises = usernamePromise
    .then(currentUsername => {
      username = currentUsername
      return this.getTemplatesJSON({ username, guideId, fileDataURL })
    })
    .then(({guideId, templateIds}) => {
      return templateIds.map(templateId => {
        return paths.getTemplatePath({ username, guideId, templateId })
      })
    })

    const templatePromises = Q.all(templatePathPromises)
      .then(templatePaths => {
        return templatePaths.map(path => {
          return files.readJSON({ path })
        })
      })

    const debugTemplatesByGuide = function (templates) {
      if (templates.length) {
        debug('Found', templates.length, 'templates for guide', guideId)
      } else {
        debug('No templates found for guideId ' + guideId)
      }
    }

    Q.all(templatePromises)
      .then(templates => {
        debugTemplatesByGuide(templates)
        callback(null, templates)
      })
      .catch(error => {
        debug(error)
        callback(error)
      })
  },

  /**
   * @property {Function} templates.update
   * @parent templates
   *
   * update the list of templateIds, usually to update build/display order
   *
   * ## Use
   *
   * PUT /api/templates/{guide_id}
   */
  update (guideId, data, params, callback) {
    debug('PUT /api/templates/' + guideId)

    const { cookieHeader } = params
    const { fileDataURL } = (params.query || '')
    const usernamePromise = user.getCurrentUser({ cookieHeader })

    const updatedTemplateIds = data.templateIds

    const templateIndexPathPromise = usernamePromise
    .then(username => {
      return paths.getTemplatesPath({ username, guideId, fileDataURL })
    })

    templateIndexPathPromise
    .then(path => {
      return files.writeJSON({ path, data: {guideId: guideId, templateIds: updatedTemplateIds} })
    })
    .then(templatesJSON => {
      callback(null, templatesJSON)
    })
    .catch(error => {
      debug(error)
      callback(error)
    })
  }
}

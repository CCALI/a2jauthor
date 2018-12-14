const axios = require('axios')
const nameSort = require('../util/name-sort')
const debug = require('debug')('A2J:routes/topics-resources-resource')

/**
 * @module {Module} /routes/topics-resources/resource template
 * @parent api
 *
 * Module containing methods for handling /topics-resources/resource route
 *
 * ## Use
 * @codestart
 * var topicsResourcesResource = require('routes/topics-resources-resource');
 * var app = feathers();
 * app.use('/api/topics-resources/resource', topicsResourcesResource);
 * @codeend
 *
 */
module.exports = {
  /**
   * @property {Function} topicsResourcesResource.find
   * @parent topicsResourcesResource
   *
   * Get a list of topicsResourcesResources from Microsoft Azure API.
   *
   * ## Use
   *
   * GET /api/topics-resources
   */
  find (params, callback) {
    const { query: { state, topic } } = params
    debug(`FIND /api/topics-resources-resource request - state=${state}, topic=${topic}`)

    if (!state && !topic) {
      return callback(new Error('State and Topic are required!'))
    }

    axios.get(`http://access2justiceapi.azurewebsites.net/api/topics-resources/resource?state=${state}&topicName=${topic}`)
      .then(({ data }) => {
        // sort the data by name
        data.sort(nameSort)
        callback(null, data)
      })
      .catch(callback)
  }
}

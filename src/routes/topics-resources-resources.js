const axios = require('axios')
const nameSort = require('../util/name-sort')
const debug = require('debug')('A2J:routes/topics-resources-resource')

/**
 * @module {Module} /routes/topics-resources/resources template
 * @parent api
 *
 * Module containing methods for handling /topics-resources/resources route
 *
 * ## Use
 * @codestart
 * var topicsResourcesResource = require('routes/topics-resources-resource');
 * var app = feathers();
 * app.use('/api/topics-resources/resources', topicsResourcesResource);
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
   * GET /api/topics-resources/resources
   */
  find (params, callback) {
    const { query: { state, topic } } = params
    debug(`FIND /api/topics-resources-resources request - state=${state}, topic=${topic}`)

    if (!state && !topic) {
      return callback(new Error('State and Topic are required!'))
    }

    axios.get(`https://api-dev.legalnav.org/api/topics-resources/resources?state=${state}&topicName=${topic}`)
      .then(({ data }) => {
        // sort the data by name
        data.sort(nameSort)
        callback(null, data)
      })
      .catch(callback)
  }
}

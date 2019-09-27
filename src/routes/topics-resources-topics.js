const axios = require('axios')
const nameSort = require('../util/name-sort')
const debug = require('debug')('A2J:routes/topics-resources-topics')

/**
 * @module {Module} /routes/topics-resources/topics template
 * @parent api
 *
 * Module containing methods for handling /topics-resources/topics route
 *
 * ## Use
 * @codestart
 * var topicsResourcesTopics = require('routes/topics-resources-topics');
 * var app = feathers();
 * app.use('/api/topics-resources/topics', topicsResourcesTopics);
 * @codeend
 *
 */
module.exports = {
  /**
   * @property {Function} topicsResourcesTopics.find
   * @parent topicsResourcesTopics
   *
   * Get a list of topics from Microsoft Azure API.
   *
   * ## Use
   *
   * GET /api/topics-resources/topics
   */
  find (params, callback) {
    const { query: { state } } = params
    debug('FIND /api/topics-resources/topics request')

    axios.get(`https://api-stage.legalnav.org/api/topics-resources/topics?state=${state}`)
      .then(({ data }) => {
        // sort the data by name
        data.sort(nameSort)
        callback(null, data)
      })
      .catch(callback)
  }
}

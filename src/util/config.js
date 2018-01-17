let config

module.exports = {
  get (key) {
    if (typeof config === 'undefined') {
      try {
        config = require('../../../config.json')
      } catch (e) {
        throw new Error('Unable to load:' + e.message)
      }
    }

    return config[key]
  }
}

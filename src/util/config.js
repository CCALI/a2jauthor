let path = require('path');
let config = {};

let debug = require('debug')('A2J:util/config');

try {
  config = require('../../../config.json');
} catch(e) {
  throw new Error('Unable to load config.json');
}

module.exports = {
  get(key){
    return config[key];
  }
}

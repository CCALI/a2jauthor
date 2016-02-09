let path = require('path');
let config = {};

let debug = require('debug')('A2J:util/config');

try {
  config = require('../../../config.json');
} catch(e) {
  debug(e);

  if (process.env.NODE_ENV !== 'production') {
    config = {
      'GUIDES_DIR': path.join(process.cwd(), '../userfiles')
    };
  }
}

module.exports = {
  get(key){
    return config[key];
  }
}

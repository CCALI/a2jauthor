const filenamify = require('filenamify');
const _kebabCase = require('lodash/kebabCase');

module.exports = function(guideTitle = '') {
  // remove reserved chars
  const filename = filenamify(guideTitle, { replacement: '' });
  return _kebabCase(filename || 'document') + '.pdf';
};

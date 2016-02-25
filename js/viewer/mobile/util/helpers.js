import can from 'can';
import $ from 'jquery';

import 'can/route/';
import 'can/view/stache/';

can.stache.registerHelper('~', function(prop, options) {
  return options.context[prop];
});

can.stache.registerHelper('inc', function(val) {
  val = typeof val === 'function' ? val() : val;
  return parseInt(val, 10) || 0 + 1;
});

can.stache.registerHelper('equal', function(a, b, options) {
  a = typeof a === 'function' ? a() : a;
  b = typeof b === 'function' ? b() : b;

  return a === b ? options.fn() : options.inverse();
});

can.stache.registerHelper('imagePath', function(prefix, src) {
  src = typeof src === 'function' ? src() : src;
  prefix = typeof prefix === 'function' ? prefix() : prefix;

  if (!/\/\//.test(src)) {
    return prefix + src;
  }

  return src;
});

can.stache.registerHelper('prefix', function(prefix, str) {
  prefix = typeof prefix === 'function' ? prefix() : prefix;
  str = typeof str === 'function' ? str() : str;

  if (str && str.length) {
    return prefix + str;
  }
});

// override for setURL issue
can.route.bindings.hashchange.setURL = function(path) {
  location.hash = path.length ? '#!' + path : '';
  return path;
};

// http://james.padolsey.com/javascript/regex-selector-for-jquery/
// Used for finding case-insensitive popup:// signatures
$.expr[':'].regex = function(elem, index, match) {
  let matchParams = match[3].split(',');
  let validLabels = /^(data|css):/;
  let attr = {
    method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
    property: matchParams.shift().replace(validLabels, '')
  };
  let regexFlags = 'ig';
  let regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);

  return regex.test(jQuery(elem)[attr.method](attr.property));
};

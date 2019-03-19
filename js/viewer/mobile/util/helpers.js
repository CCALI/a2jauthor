import stache from 'can-stache'
import route from 'can-route'
import $ from 'jquery'
import _isFunction from 'lodash/isFunction'
import normalizePath from 'caja/viewer/util/normalize-path'

stache.registerHelper('~', function (prop, options) {
  return options.context[prop]
})

stache.registerHelper('inc', function (val) {
  val = typeof val === 'function' ? val() : val
  return parseInt(val, 10) || 0 + 1
})

stache.registerHelper('normalizePath', function (fileDataURL, path) {
  path = _isFunction(path) ? path() : path
  fileDataURL = _isFunction(fileDataURL) ? fileDataURL() : fileDataURL

  return normalizePath(fileDataURL, path)
})

// override for setURL issue
route.bindings.hashchange.setURL = function (path) {
  location.hash = path.length ? '#!' + path : ''
  return path
}

// http://james.padolsey.com/javascript/regex-selector-for-jquery/
// Used for finding case-insensitive popup:// signatures
$.expr[':'].regex = function (elem, index, match) {
  let matchParams = match[3].split(',')
  let validLabels = /^(data|css):/
  let attr = {
    method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
    property: matchParams.shift().replace(validLabels, '')
  }
  let regexFlags = 'ig'
  let regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags)

  return regex.test($(elem)[attr.method](attr.property))
}

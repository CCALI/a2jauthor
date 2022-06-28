/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	10/2013
	JavaScript functions with JSLint complaints.
	Companion to A2J_Shared.js - contains Lint-unfriendly but valid code

*/

var REG = {
  LOGIC_SET: /set\s+(.+)/i,
  LOGIC_SETTO: /set\s+([\w#]+|\[.+\])\s*?\s(=|TO)\s+?(.+)/i,
  LOGIC_GOTO: /^goto\s+\"(.+)\"/i,
  LOGIC_GOTO2: /^\s*goto\s+(.+)/i,
  LOGIC_TRACE: /trace\s+(.+)/i,
  LOGIC_WRITE: /write\s+(.+)/i,
  LOGIC_ELSEIF: /^else if\s+(.+)/i,
  LOGIC_IF: /^if\s+(.+)/i,
  LOGIC_LE: /\<\=\=/gi,
  LOGIC_NE: /\<\>/gi,
  LINK_POP: /\"POPUP:\/\/(([^\"])+)\"/ig,
  LINK_POP2: /\"POPUP:\/\/(([^\"])+)\"/i
}

String.prototype.simpleHash = function () {	// Return a simple hash of string. MD5 or other preferred but will do in a pinch.
  //
  var str = String(this)
  // http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
  return str.split('').reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
}

// TODO: this import doesn't work due to import timing of legacy code in app.js
// functions below are a copy paste of the module, minus the custom alphabet code
// https://www.npmjs.com/package/string-natural-compare
// should import this module normally when this code is refactored to CanJS
// import naturalCompare from 'string-natural-compare';

function isNumberCode (code) {
  return code >= 48 && code <= 57
}

function naturalCompare (a, b) {
  var lengthA = (a += '').length
  var lengthB = (b += '').length
  var aIndex = 0
  var bIndex = 0

  while (aIndex < lengthA && bIndex < lengthB) {
    var charCodeA = a.charCodeAt(aIndex)
    var charCodeB = b.charCodeAt(bIndex)

    if (isNumberCode(charCodeA)) {
      if (!isNumberCode(charCodeB)) {
        return charCodeA - charCodeB
      }

      var numStartA = aIndex
      var numStartB = bIndex

      while (charCodeA === 48 && ++numStartA < lengthA) {
        charCodeA = a.charCodeAt(numStartA)
      }
      while (charCodeB === 48 && ++numStartB < lengthB) {
        charCodeB = b.charCodeAt(numStartB)
      }

      var numEndA = numStartA
      var numEndB = numStartB

      while (numEndA < lengthA && isNumberCode(a.charCodeAt(numEndA))) {
        ++numEndA
      }
      while (numEndB < lengthB && isNumberCode(b.charCodeAt(numEndB))) {
        ++numEndB
      }

      var difference = numEndA - numStartA - numEndB + numStartB // numA length - numB length
      if (difference) {
        return difference
      }

      while (numStartA < numEndA) {
        difference = a.charCodeAt(numStartA++) - b.charCodeAt(numStartB++)
        if (difference) {
          return difference
        }
      }

      aIndex = numEndA
      bIndex = numEndB
      continue
    }

    if (charCodeA !== charCodeB) {
      return charCodeA - charCodeB
    }

    ++aIndex
    ++bIndex
  }

  return lengthA - lengthB
}

naturalCompare.caseInsensitive = naturalCompare.i = function (a, b) {
  return naturalCompare(('' + a).toLowerCase(), ('' + b).toLowerCase())
}// end string natural-compare code

// http://stackoverflow.com/questions/5796718/html-entity-decode
var decodeEntities = (function () {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div')

  function decodeHTMLEntities (str) {
    if (str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
      element.innerHTML = str
      str = element.textContent
      element.textContent = ''
    }

    return str
  }

  return decodeHTMLEntities
})()
/* */

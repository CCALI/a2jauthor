import constants from 'caja/viewer/models/constants';

export default {
  strcmp: function(a, b) {
    // Utility function to compare two strings REGARDLESS OF CASE.
    // Return 0 if a and b are equal regardless of case.
    // Return -1 if a is less than b.
    // Return +1 if a is greater than b.
    // quick check for equality before we do uppercase function
    if (a === b) return 0;
    if (a === null || typeof a === 'undefined') a = '';
    if (b === null || typeof b === 'undefined') b = '';

    a = a.toUpperCase();
    b = b.toUpperCase();

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  },

  fieldTypeToVariableType: function(type) {
    // Return variable type corresponding to this field type.
    var varType;
    switch (type) {
      case constants.ftText:
      case constants.ftTextLong:
      case constants.ftNumberSSN:
      case constants.ftNumberPhone:
      case constants.ftNumberZIP:
        varType = constants.vtText;
        break;
      case constants.ftRadioButton:
      case constants.ftGender:
      case constants.ftTextPick:
      case constants.ftCheckBoxMultiple:
        varType = constants.vtMC;
        break;
      case constants.ftCheckBox:
      case constants.ftCheckBoxNOTA:
        varType = constants.vtTF;
        break;
      case constants.ftNumber:
      case constants.ftNumberDollar:
      case constants.ftNumberPick:
        varType = constants.vtNumber;
        break;
      case constants.ftDateMDY:
        varType = constants.vtDate;
        break;
      default:
        varType = constants.vtText;
        break;
    }

    return varType;
  },

  makestr: function(s) {
    // lazy test to make sure s is a string or blank, not "null" or "undefined"
    return (s === null || typeof s === 'undefined') ? '' : s;
  },

  // not sure if should be a string or date method or both - most likely redundant, and not needed
  ismdy: function(str) {
    //  Return true if str looks like a date (m/d/y)
    if (typeof str === 'string') {
        var parts = str.split('/');
        if (parts.length === 3) {
        return this.isNumber(parts[0]) && this.isNumber(parts[1]) && this.isNumber(parts[2]) ;
        }
    }

    return false;
    },

  escapeHtml: function(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  textToNumber: function(n) {
    // Convert to number even with commas.
    // Used to return 0 for falsey values, but was breaking 'hasanswered' macro - should return null instead
    // with better variable type controls, this function should only be needed to handle string numbers with commas
    // and maybe not even that if numeral.js is used.
    if (typeof n === 'string') {
      n = n.replace(/,/g, ''); // English Only TODO: handle international numbers
    }

    if (isNaN(parseFloat(n))) {
      return null;
    }

    return parseFloat(n);
  },

  isNumber: function(n) {
    //http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  decodeEntities: (function() {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities(str) {
      if (str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
      }

      return str;
    }

    return decodeHTMLEntities;
  })(),

  jquote: function(str) {
    return '"' + str.replace(/"/gi, '\\"') + '"';
  }

};

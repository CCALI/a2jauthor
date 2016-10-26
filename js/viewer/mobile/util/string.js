import constants from 'viewer/models/constants';
import moment from 'moment';

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

  swapMonthAndDay: function(stringDate) {
    // LHI uses british dates in HotDocs. This converts Brit and US dates in both directions
    var result = '';

    if (this.makestr(stringDate) !== '') {
      var parts = stringDate.split('/');
      result = parts[1] + '/' + parts[0] + '/' + parts[2];
    }

    return result;
  },

  htmlEscape: function(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  textToNumber: function(n) {
    // Convert to number even with commas.
    // If it's text, return 0.
    if (n === '' || n === null || typeof n === 'undefined' || n === 'false') {
      return 0;
    }

    if (n === 'true') {
      return true;
    }

    if (this.isNumber(n)) {
      return parseFloat(n);
    }

    n = String(n).replace(',', ''); //English Only
    if (this.isNumber(n)) {
      return parseFloat(n);
    }

    return 0;
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

  jsDate2days: function(d) {
    // Convert JS date into days since 1/1/1970
    const refDate = moment('01/01/1970');
    const jsDate = moment(d);

    const totalDays = jsDate.diff(refDate, 'days');
    return totalDays;
  },

  days2jsDate: function(numDays) {
    // Return JS Date based on days since 1/1/1970
    const refDate = moment('01/01/1970');
    const newDate = refDate.add(numDays, 'days');

    return newDate.toDate();
  },

  mdy2jsDate: function(MDY) {
    // 2014-06-16 Convert a2j m/d/y date to JavaScript date object for use in calculations
    if (this.makestr(MDY) !== '') {
      const date = moment(MDY);
      return date.toDate();
    }
    else {
      // return today if we don't recognize it.
      const currentDay = moment();
      return currentDay.toDate();
    }
  },

  jsDate2mdy: function (d) {
  // 2014-06-16 Convert js date to A2J's M/D/Y format
    const date = moment(d);
    return date.format('MM/DD/YYYY');
  },

  today2jsDate: function() {
    return this.mdy2jsDate('');
  },

  jquote: function(str) {
    return '"' + str.replace(/"/gi, '\\"') + '"';
  }
};

import $ from 'jquery';
import Model from 'can/model/';
import _find from 'lodash/find';
import CONST from 'viewer/models/constants';
import cString from 'viewer/mobile/util/string';
import readableList from 'viewer/util/readable-list';

import 'can/map/define/';

export default Model.extend('Answers',{}, {
  define: {
    lang: {
      serialize: function() {
        return;
      }
    }
  },

  varExists: function(prop) {
    prop = $.trim(prop).toLowerCase();

    let keys = can.Map.keys(this);

    let key = _find(keys, function(k) {
      return k.toLowerCase() === prop;
    });

    let v;

    if (key) {
      v = this.attr(key);

      if (!v.attr('values')) {
        v.attr('values', [null]);
      }
    }

    return typeof v === 'undefined' ? null : v;
  },

  varCreate: function(varName, varType, varRepeat) {
    this.attr(varName.toLowerCase(), {
      name: varName,
      repeating: varRepeat,
      type: varType,
      values: [null]
    });

    return this.attr(varName.toLowerCase());
  },

  varGet: function(varName, varIndex, opts) {
    var v = this.varExists(varName);

    if (!v) return undefined;

    if (typeof varIndex === 'undefined' || varIndex === null || varIndex === '') {
      if (v.repeating) {
        // Repeating variable without an index returns a readable list for display
        return readableList(v.values, this.attr('lang'));

      }

      varIndex = 1;
    }

    var val = v.values[varIndex];
    switch (v.type) {
      case CONST.vtNumber:
        if (opts && opts.num2num === true) {
          // For calculations for number to be number even if blank.
          val = cString.textToNumber(val);
        }

        break;

      case CONST.vtDate:
        if (opts && opts.date2num === true) {
          // For calculations like comparing dates or adding days we convert date to number,
          //  daysSince1970, like A2J 4.
          if (val !== '') {
            // 11/28/06 If date is blank DON'T convert to number.
            val = cString.jsDate2days(cString.mdy2jsDate(val));
          }
        }

        break;

      case CONST.vtText:
        if (opts && opts.date2num === true && cString.ismdy(val)) {
          // If it's a date type or looks like a date time, convert to number of days.
          val = cString.jsDate2days(cString.mdy2jsDate(val));
        }

        break;

      case CONST.vtTF:
        if (typeof val === 'string') {
          val = val.toLowerCase() === "true" ? true : false;
        } else {
          val = (val === true) || (parseInt(val) > 0);
        }
        break;
    }

    return val;
  },

  varSet: function(varName, varVal, varIndex) {
    let v = this.varExists(varName);

    if (v === null) {
      // Create variable at runtime
      v = this.varCreate(varName, CONST.vtText,
        !((typeof varIndex === 'undefined') || (varIndex === null) ||
          (varIndex === '') || (varIndex === 0)), '');
    }

    if ((typeof varIndex === 'undefined') || (varIndex === null) || (varIndex === '')) {
      varIndex = 0;
    }

    // Handle type conversion, like number to date and null to proper `notanswered` values.
    switch (v.attr('type')) {
      case CONST.vtDate:
        if (typeof varVal === 'number') {
          varVal = cString.jsDate2mdy(cString.days2jsDate(varVal));
        }
        break;
      case CONST.vtText:
        if (varVal === null) {
          varVal = '';
        }
        break;
      case CONST.vtTF:
        if (varVal === null) {
          varVal = false;
        }
        break;
    }

    // Reset all values or set new single value
    if (varIndex === 0 && varVal === null) {
      v.attr('values', [null]);
    }
    else if (varIndex === 0) {
      v.attr('values.1', varVal);
    }
    else {
      v.attr('values.' + varIndex, varVal);
    }
  }
});

import Map from 'can/map/';
import moment from 'moment';
import _isNull from 'lodash/isNull';
import _isUndefined from 'lodash/isUndefined';

import 'can/map/define/';

/**
 * @property {can.Map} validations.prototype.Config
 * @parent viewer/mobile/util/validations
 *
 * validations Config Constructor
 *
 * defines the type of each property in the validations Map
 */
let Config = Map.extend({
  define: {
    maxChars: {
      type: 'number'
    },

    /**
     * @property {String} validations.Config.prototype.min min
     * @parent validations.prototype.Config
     *
     * the minimum value of a property
     * if this is a datemdy type, min will be converted to a date
     * if this is a datemdy type and the value is 'TODAY', min will be converted to today's date
     * otherwise the value is returned as a number
     */
    min: {
      type: function(val) {
        if (this.attr('type') === 'datemdy') {
          if (!val) {
            return '';
          }
          let date = (val.toUpperCase() === 'TODAY') ? moment() : moment(val);
          return date.isValid() ? date.format('MM/DD/YYYY') : '';
        }

        return +val;
      }
    },

    /**
     * @property {String} validations.Config.prototype.max max
     * @parent validations.prototype.Config
     *
     * the maximum value of a property
     * if this is a datemdy type, max will be converted to a date
     * if this is a datemdy type and the value is 'TODAY', max will be converted to today's date
     * otherwise the value is returned as a number
     */
    max: {
      type: function(val) {
        if (this.attr('type') === 'datemdy') {
          if (!val) {
            return '';
          }
          let date = (val.toUpperCase() === 'TODAY') ? moment() : moment(val);
          return date.isValid() ? date.format('MM/DD/YYYY') : '';
        }

        return +val;
      }
    },

    /**
     * @property {Boolean} validations.Config.prototype.required required
     * @parent validations.prototype.Config
     *
     * whether the property is required
     */
    required: {
      type: 'boolean'
    }
  }
});

/**
 * @module {can.Map} viewer/mobile/util/validations validations
 * @parent viewer/mobile/util
 *
 * Validations map
 *
 * ## Use
 *
 * @codestart
 *   var validations = new Validations({
 *      config: {
 *        type: 'datemdy',
 *        min: '12/01/2012',
 *        max: 'TODAY',
 *        required: true
 *     }
 *   });
 *   validations.attr('val', '12/15/2014');
 *   var error = validations.required() || validations.min() || validations.max();
 * @codeend
 */
export default Map.extend({
  define: {
    /**
     * @property {can.Map} validations.prototype.config config
     * @parent validations
     *
     * instance of Config map
     */
    config: {
      Type: Config,
      Value: Config
    },

    /**
     * @property {String} validations.prototype.val val
     * @parent validations
     *
     * current value
     */
    val: {
      type(val) {
        if (this.attr('config.type') === 'datemdy') {
          let date = moment(val, 'YYYY-MM-DD');
          return date.isValid() ? date.toDate() : '';
        }

        return val;
      }
    }
  },

  /**
   * @property {String} validations.prototype.require require
   * @parent validations
   *
   * returns true if the val is required and empty
   */
  required: function() {
    if (this.config.required &&
      (_isNull(this.val) ||
        _isUndefined(this.val) ||
        (typeof this.val === 'string' && !this.val.length))) {
      return true;
    }
  },

  /**
   * @property {String} validations.prototype.maxChars maxChars
   * @parent validations
   *
   * returns true if the val is longer than the configured maxChars
   */
  maxChars: function() {
    if (this.config.maxChars &&
      this.val && this.val.length > this.config.maxChars) {
      return true;
    }
  },

  /**
   * @property {String} validations.prototype.min min
   * @parent validations
   *
   * returns true if the val is lower than the configured minimum
   */
  min: function() {
    if (this.config.min) {
      if (!this.val) {
        return false;
      }

      if (this.config.type === 'datemdy') {
        if (moment(this.val).isBefore(this.config.min)) {
          return true;
        }
      } else {
        if (this.val < this.config.min) {
          return true;
        }
      }
    }
  },

  /**
   * @property {String} validations.prototype.max max
   * @parent validations
   *
   * returns true if the val is higher than the configure maximum
   */
  max: function() {
    if (this.config.max) {
      if (!this.val) {
        return false;
      }

      if (this.config.type === 'datemdy') {
        if (moment(this.val).isAfter(this.config.max)) {
          return true;
        }
      } else {
        if (this.val > this.config.max) {
          return true;
        }
      }
    }
  }
});

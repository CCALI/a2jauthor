import Map from 'can/map/';
import moment from 'moment';
import _isNull from 'lodash/lang/isNull';
import _isUndefined from 'lodash/lang/isUndefined';

import 'can/map/define/';

let Config = Map.extend({
  define: {
    maxChars: {
      type: 'number'
    },

    min: {
      type: function(val) {
        if (this.attr('type') === 'datemdy') {
          if (!val) {
            return '';
          }
          let date = (val === 'TODAY') ? moment() : moment(val);
          return date.isValid() ? date.format('MM/DD/YYYY') : '';
        }

        return +val;
      }
    },

    max: {
      type: function(val) {
        if (this.attr('type') === 'datemdy') {
          if (!val) {
            return '';
          }
          let date = (val === 'TODAY') ? moment() : moment(val);
          return date.isValid() ? date.format('MM/DD/YYYY') : '';
        }

        return +val;
      }
    },

    required: {
      type: 'boolean'
    }
  }
});

export default Map.extend({
  define: {
    config: {
      Type: Config,
      Value: Config
    },

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

  required: function() {
    if (this.config.required
      && (_isNull(this.val)
            || _isUndefined(this.val)
            || (typeof this.val === 'string' && !this.val.length))) {
      return true;
    }
  },

  maxChars: function() {
    if (this.config.maxChars
      && this.val && this.val.length > this.config.maxChars) {
      return true;
    }
  },

  min: function() {
    if (this.config.min) {
      if (!this.val) {
        return true;
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

  max: function() {
    if (this.config.max) {
      if (!this.val) {
        return true;
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

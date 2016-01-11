import Map from 'can/map/';
import moment from 'moment';
import _filter from 'lodash/collection/filter';
import _reduce from 'lodash/collection/reduce';
import Validations from 'viewer/mobile/util/validations';

import 'can/map/define/';
import 'can/map/validations/';

export default Map.extend({
  init: function() {
    this.validate('values', function(val) {
      var field = this.attr('field');
      if (!field) return;

      var validations = new Validations({
        config: {
          type: field.type,
          maxChars: field.maxChars,
          min: field.min,
          max: field.max,
          required: field.required
        }
      });

      validations.attr('val', val);

      switch (field.type) {
        case 'text':
        case 'textlong':
        case 'numberphone':
          return validations.required() || validations.maxChars();
          break;
        case 'numberssn':
          return validations.required();
          break;
        case 'numberzip':
          return validations.required() || validations.maxChars();
          break;
        case 'number':
        case 'numberpick':
        case 'numberdollar':
          return validations.required() || validations.min() || validations.max();
          break;
        case 'gender':
          return validations.required();
          break;
        case 'datemdy':
          return validations.required() || validations.min() || validations.max();
          break;
        case 'checkbox':
        case 'radio':
        case 'checkboxNOTA':
          let self = this;
          let fields = this.attr('field').page.attr('fields');

          fields = _filter(fields, function(f) {
            if (field.type === 'checkbox' || field.type === 'checkboxNOTA') {
              return f.type === 'checkbox' || f.type === 'checkboxNOTA';
            }

            return f.type === field.type;
          });

          var v = _reduce(fields, function(v, field) {
            var answer = field.attr('answer.values.' + self.attr('answerIndex'));

            return val || v || !!answer;
          }, !!fields[0].attr('answer.values.' + self.attr('answerIndex')));

          validations.attr('val', v || null);

          return validations.required();
          break;
        case 'textpick':
          return validations.required();
          break;
      }
    });
  }
}, {
  field: null,
  answer: null,
  answerIndex: 1,
  define: {
    values: {
      get: function() {
        let type = this.attr('field.type');
        let raw = this.attr('answer.values.' + this.attr('answerIndex'));

        if (type === 'datemdy') {
          return raw ? moment(raw, 'MM/DD/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        }

        return raw;
      },

      set: function(val) {
        let index = this.attr('answerIndex');
        let type = this.attr('field.type');

        if (type === 'datemdy') {
          val = moment(val, 'YYYY-MM-DD').format('MM/DD/YYYY');
        }

        if (!this.attr('answer')) {
          this.attr('answer', {});
        }

        if (!this.attr('answer.values')) {
          this.attr('answer.values', [null]);
        }

        this.attr('answer.values.' + index, val);
      }
    }
  }
});

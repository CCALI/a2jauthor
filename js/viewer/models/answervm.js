import Map from 'can/map/';
import moment from 'moment';
import _some from 'lodash/some';
import _filter from 'lodash/filter';
import Validations from 'viewer/mobile/util/validations';

import 'can/map/define/';
import 'can/map/validations/';

export default Map.extend('AnswerVM', {
  init() {
    this.validate('values', function(val) {
      const field = this.attr('field');

      if (!field) return;

      const validations = new Validations({
        config: {
          type: field.type,
          maxChars: field.maxChars,
          min: field.min,
          max: field.max,
          required: field.required
        }
      });

      validations.attr('val', val);

      let invalid;

      switch (field.type) {
        case 'text':
        case 'textlong':
        case 'numberphone':
        case 'numberssn':
        case 'numberzip':
          invalid = validations.required() || validations.maxChars();
          break;
        case 'number':
        case 'numberdollar':
        case 'numberpick':
        case 'datemdy':
          invalid = validations.required() || validations.min() || validations.max();
          break;
        case 'gender':
        case 'textpick':
          invalid = validations.required();
          break;
        case 'checkbox':
        case 'radio':
        case 'checkboxNOTA':
          const fields = this.attr('fields');
          const index = this.attr('answerIndex');

          const checkboxes = _filter(fields, function(f) {
            // if the field being validated is either 'checkbox' or 'checkboxNOTA',
            // we need to filter all fields which are either of those types.
            if (field.type === 'checkbox' || field.type === 'checkboxNOTA') {
              return f.type === 'checkbox' || f.type === 'checkboxNOTA';
            // otherwise filter fields that are 'radio' type.
            } else {
              return f.type === 'radio';
            }
          });

          const anyChecked = _some(checkboxes, function(checkbox) {
            return !!checkbox.attr(`_answer.answer.values.${index}`);
          });

          validations.attr('val', anyChecked || null);

          invalid = validations.required();
          break;
      }

      return invalid;
    });
  }
}, {
  field: null,
  answer: null,
  answerIndex: 1,
  define: {
    values: {
      get() {
        const type = this.attr('field.type');
        const index = this.attr('answerIndex');
        const previousValue = this.attr(`answer.values.${index}`);

        if (type === 'datemdy') {
          const date = moment(previousValue, 'MM/DD/YYYY');
          return date.isValid() ? date.format('YYYY-MM-DD') : '';
        }

        return previousValue;
      },

      set(val) {
        const index = this.attr('answerIndex');
        const type = this.attr('field.type');

        if (type === 'datemdy') {
          const date = moment(val, 'YYYY-MM-DD');
          val = date.isValid() ? date.format('MM/DD/YYYY') : '';
        }

        if (!this.attr('answer')) {
          this.attr('answer', {});
        }

        if (!this.attr('answer.values')) {
          this.attr('answer.values', [null]);
        }

        this.attr(`answer.values.${index}`, val);
      }
    }
  }
});

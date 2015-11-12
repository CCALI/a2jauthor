import Map from 'can/map/';
import moment from 'moment';
import views from './views/';
import Component from 'can/component/';
import template from './field.stache!';

let FieldVM = Map.extend({
  define: {
    showInvalidPrompt: {
      get() {
        let field = this.attr('field');
        let hasError = field.attr('hasError');
        let invalidPrompt = field.attr('invalidPrompt');

        return hasError && invalidPrompt;
      }
    }
  },

  validateField(ctx, el) {
    let field = this.attr('field');
    let answer = field.attr('_answer');

    answer.attr('values', el.val());
    field.attr('hasError', !!answer.errors());
  }
});

export default Component.extend({
  template,
  tag: 'a2j-field',
  viewModel: FieldVM,

  helpers: {
    selector: function(type, options) {
      type = typeof type === 'function' ? type() : type;

      let self = this;

      // TODO: CanJS should allow for passing helpers as well as scope.
      // This below is a copy of screenManager's eval helper.
      return views[type](options.scope, {
        eval: function(str) {
          str = typeof str === 'function' ? str() : str;
          return self.attr('logic').eval(str);
        },

        selectnum: function(options) {
          let result = [];
          let min = this.attr('field.min');
          let max = this.attr('field.max');

          for (var i = min; i <= max; i++) {
            result.push(options.fn(options.scope.add({
              '@index': i
            }).add(i)));
          }

          return result;
        },

        dateformat: function(val, format, options) {
          val = typeof val === 'function' ? val() : val;
          format = typeof format === 'function' ? format() : format;

          return val ? moment(val, 'MM/DD/YYYY').format(format) : val;
        },

        i11n: function(key) {
          key = typeof key === 'function' ? key() : key;
          return this.attr('lang.' + key);
        }
      });
    }
  }
});

import Map from 'can/map/';
import moment from 'moment';
import views from './views/';
import Component from 'can/component/';
import template from './field.stache!';

export let FieldVM = Map.extend({
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

    let value = el.val();
    answer.attr('values', value);

    let errors = answer.errors();
    field.attr('hasError', !!errors);

    if (!errors) {
      let name = field.attr('name').toLowerCase();
      let message = {};

      message[name] = [
        { format: 'var', msg: name },
        { msg: ' = ' },
        { format: 'val', msg: value }
      ];

      this.attr('traceLogic').push(message);
    }
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
          let min = self.attr('field.min');
          let max = self.attr('field.max');

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

        i18n: function(key) {
          key = typeof key === 'function' ? key() : key;
          return self.attr('lang').attr(key) || key;
        }
      });
    }
  }
});

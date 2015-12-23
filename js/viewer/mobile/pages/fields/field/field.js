import Map from 'can/map/';
import moment from 'moment';
import views from './views/';
import Component from 'can/component/';
import template from './field.stache!';

/**
 * @property {can.Map} field.ViewModel
 * @parent <a2j-field>
 *
 * `<a2j-field>`'s viewModel.
 */
export let FieldVM = Map.extend({
  define: {
    showInvalidPrompt: {
      get() {
        let field = this.attr('field');
        let hasError = field.attr('hasError');
        let invalidPrompt = field.attr('invalidPrompt');

        return hasError && invalidPrompt;
      }
    },

    /**
     * @property {Boolean} field.ViewModel.prototype.supportsNativeDateInput supportsNativeDateInput
     * @parent field.ViewModel
     *
     * Whether the current browsers supports native Date input fields
     * by detecting if a date input automatically sanitizes non-date values
     * technique from http://stackoverflow.com/a/10199306
     *
     */
    supportsNativeDateInput: {
      get() {
        let input = document.createElement('input');
        input.setAttribute('type', 'date');

        let illegalValue = 'illegal value';
        input.setAttribute('value', illegalValue);

        return (input.value !== illegalValue);
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
      let name = field.attr('name');
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

/**
 * @module {Module} viewer/mobile/pages/fields/field/ <a2j-field>
 * @parent viewer/mobile/pages/fields/
 *
 * This component allows you to display a form field of a specific type
 *
 * ## use
 * @codestart
 * <a2j-field
 *    {(field)}="field
 *    {repeat-var-value}="repeatVarValue"
 *    {(logic)}="logic"
 *    {lang}="lang"
 *    {(trace-logic)}="traceLogic" />
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'a2j-field',
  viewModel: FieldVM,

  events: {
    '{field._answer.answer.values} change': function(values, ev, attr) {
      if (attr === '1') {
        let message = {};
        let msgVar = this.viewModel.attr('field.name');
        message[msgVar] = [
          { format: 'var', msg: msgVar },
          { msg: ' = ' },
          { format: 'val', msg: values[attr] }
        ];
        this.viewModel.attr('traceLogic').push(message);
      }
    }
  },

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
              '%index': i
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

import $ from 'jquery';
import Map from 'can/map/';
import moment from 'moment';
import views from './views/';
import Component from 'can/component/';
import template from './field.stache!';
import invalidPromptTpl from './views/invalidPrompt.stache';

import 'jquery-ui/ui/datepicker';

can.view.preload('invalid-prompt-tpl', invalidPromptTpl);

/**
 * @property {can.Map} field.ViewModel
 * @parent <a2j-field>
 *
 * `<a2j-field>`'s viewModel.
 */
export let FieldVM = Map.extend({
  define: {
    /**
     * @property {Boolean} field.ViewModel.prototype.showInvalidPrompt showInvalidPrompt
     * @parent field.ViewModel
     *
     * Whether a prompt should be shown to indicate the field's answer is invalid
     *
     */
    showInvalidPrompt: {
      get() {
        return this.attr('field.hasError') && this.attr('invalidPrompt');
      }
    },

    /**
     * @property {String} field.ViewModel.prototype.invalidPrompt invalidPrompt
     * @parent field.ViewModel
     *
     * The prompt that should be shown when a field's answer is invalid
     *
     */
    invalidPrompt: {
      get() {
        let field = this.attr('field');
        let defaultInvalidPrompt = this.attr('lang').attr('FieldPrompts_' + field.attr('type'));
        return field.attr('invalidPrompt') || defaultInvalidPrompt;
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
        if (this.attr('field.type') !== 'datemdy') {
          return true;
        } else {
          let input = this.attr('document').createElement('input');
          input.setAttribute('type', 'date');

          let illegalValue = 'illegal value';
          input.setAttribute('value', illegalValue);

          return (input.value !== illegalValue);
        }
      }
    },

    /**
     * @property {Boolean} field.ViewModel.prototype.document document
     * @parent field.ViewModel
     *
     * allows overriding of global document for testing supportsNativeDateInput
     *
     */
    document: {
      value: window.document
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
  },

  convertDate(date, outputFormat, inputFormat) {
    inputFormat = inputFormat || 'YYYY-MM-DD';
    outputFormat = outputFormat || 'MM/DD/YYYY';

    return (date && date !== 'TODAY') ? moment(date, inputFormat).format(outputFormat) : date;
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
    inserted() {
      let vm = this.viewModel;

      if (!vm.attr('supportsNativeDateInput')) {
        let defaultDate = vm.convertDate(vm.attr('field._answer.values')) || null;
        let minDate = vm.convertDate(vm.attr('field.min')) || null;
        let maxDate = vm.convertDate(vm.attr('field.max')) || null;
        let lang = vm.attr('lang');

        $('input', this.element).datepicker({
          defaultDate,
          minDate,
          maxDate,
          monthNames: lang.MonthNamesLong.split(','),
          monthNamesShort: lang.MonthNamesShort.split(','),
          dateFormat: 'mm/dd/yy',
          onSelect(dateText) {
            let $el = $(this);
            let val = $el.val();
            let unformattedVal = vm.convertDate(val, 'YYYY-MM-DD','MM/DD/YYYY')
            $el.val(unformattedVal);

            vm.validateField(null, $el);

            $el.val(val);
          }
        }).val(defaultDate);
      }
    },
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
          val = val.isComputed ? val() : val;
          format = format.isComputed ? format() : format;
          return self.convertDate(val, format);
        },

        i18n: function(key) {
          key = typeof key === 'function' ? key() : key;
          return self.attr('lang').attr(key) || key;
        }
      });
    }
  }
});

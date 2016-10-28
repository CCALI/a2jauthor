import $ from 'jquery';
import Map from 'can/map/';
import moment from 'moment';
import List from 'can/list/';
import views from './views/';
import _range from 'lodash/range';
import _isNaN from 'lodash/isNaN';
import Component from 'can/component/';
import template from './field.stache!';
import invalidPromptTpl from './views/invalid-prompt.stache!';

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
     * @property {List} field.ViewModel.prototype.numberPickOptions numberPickOptions
     * @parent field.ViewModel
     *
     * List of integers used to render the `select` tag options when the field
     * type is 'numberpick'. e.g, if `field.min` is `1` and and `field.max` is
     * `5`, this property would return `[1, 2, 3, 4, 5]`.
     */
    numberPickOptions: {
      get() {
        const min = parseInt(this.attr('field.min'), 10);
        const max = parseInt(this.attr('field.max'), 10);
        const options = (_isNaN(min) || _isNaN(max)) ? [] : _range(min, max + 1);

        return new List(options);
      }
    },

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
     * @property {Boolean} field.ViewModel.prototype.shouldBeChecked shouldBeChecked
     * @parent field.ViewModel
     *
     * Whether a Radio Button should be checked based on saved answers
     *
     */
    shouldBeChecked: {
      get: function() {
        let name = this.attr('field.name').toLowerCase();
        if (name) {
          let value = this.attr('field.value');
          let answer = this.attr('logic.interview.answers').attr(name).values[1];
          return (value === answer);
        }
      }
    },

   /**
     * @property {String} field.ViewModel.prototype.savedGenderValue savedGenderValue
     * @parent field.ViewModel
     *
     * Used to determine if gender radio button should be checked based on saved answer
     *
     */
    savedGenderValue: {
      get: function() {
        let name = this.attr('field.name').toLowerCase();
        if (name) {
          return this.attr('logic.interview.answers').attr(name).values[1];
        }
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

  /**
   * @property {Function} field.ViewModel.prototype.validateField validateField
   * @parent field.ViewModel
   *
   * validates a field for errors
   *
   */
  validateField(ctx, el) {
    let field = this.attr('field');
    let answer = field.attr('_answer');
    let value;

    if (field.type === "checkbox" || field.type === "checkboxNOTA") {
      value = el[0].checked;
    } else {
      value = el.val();
    }

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

  /**
   * @property {Function} field.ViewModel.prototype.convertDate convertDate
   * @parent field.ViewModel
   *
   * convert a Date using moment with options input and output formats
   *
   * ## use
   * @codestart
   * vm.convertDate('2015-12-01'); // "12/01/2015"
   * vm.convertDate('2015-12-01', 'YYYY-MM-DD'); // "2015-12-01"
   * vm.convertDate('2015/12/01', 'YYYY-MM-DD', 'YYYY/MM/DD'); // "2015-12-01"
   * @codeend
   */
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
          appendText: '(mm/dd/yyyy)',
          dateFormat: 'mm/dd/yy',
          onClose() {
            let $el = $(this);
            let val = $el.val();
            let unformattedVal = vm.convertDate(val, 'YYYY-MM-DD', 'MM/DD/YYYY');
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
    selector(type, options) {
      type = typeof type === 'function' ? type() : type;

      let self = this;

      // TODO: CanJS should allow for passing helpers as well as scope.
      // This below is a copy of screenManager's eval helper.
      return views[type](options.scope, {
        eval(str) {
          str = typeof str === 'function' ? str() : str;

          return self.attr('logic').eval(str);
        },

        dateformat(val, format) {
          val = val.isComputed ? val() : val;
          format = format.isComputed ? format() : format;
          return self.convertDate(val, format);
        },

        i18n(key) {
          key = typeof key === 'function' ? key() : key;
          return self.attr('lang').attr(key) || key;
        }
      });
    }
  }
});

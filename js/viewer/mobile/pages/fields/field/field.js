import $ from 'jquery'
import CanMap from 'can-map'
import moment from 'moment'
import CanList from 'can-list'
import views from './views/'
import _range from 'lodash/range'
import _isNaN from 'lodash/isNaN'
import Component from 'can-component'
import template from './field.stache'
import invalidPromptTpl from './views/invalid-prompt.stache'
import exceededMaxcharsTpl from './views/exceeded-maxchars.stache'
import constants from 'caja/viewer/models/constants'
import stache from 'can-stache'

import 'jquery-ui/ui/datepicker'

stache.registerPartial('invalid-prompt-tpl', invalidPromptTpl)
stache.registerPartial('exceeded-maxchars-tpl', exceededMaxcharsTpl)

/**
 * @property {can.Map} field.ViewModel
 * @parent <a2j-field>
 *
 * `<a2j-field>`'s viewModel.
 */
export let FieldVM = CanMap.extend('FieldVM', {
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
      get () {
        const min = parseInt(this.attr('field.min'), 10)
        const max = parseInt(this.attr('field.max'), 10)
        const options = (_isNaN(min) || _isNaN(max)) ? [] : _range(min, max + 1)

        return new CanList(options)
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
      get () {
        return this.attr('field.hasError') && this.attr('invalidPrompt')
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
      get () {
        let field = this.attr('field')
        let defaultInvalidPrompt = this.attr('lang').attr('FieldPrompts_' + field.attr('type'))
        return field.attr('invalidPrompt') || defaultInvalidPrompt
      }
    },

    /**
     * @property {Boolean} field.ViewModel.prototype.showMinMaxPrompt showMinMaxPrompt
     * @parent field.ViewModel
     *
     * Whether a prompt should be shown to indicate the field's min and max values
     *
     */
    showMinMaxPrompt: {
      get () {
        const min = this.attr('field.min')
        const max = this.attr('field.max')
        return !!(min || max)
      }
    },

    /**
     * @property {String} field.ViewModel.prototype.minMaxPrompt minMaxPrompt
     * @parent field.ViewModel
     *
     * The prompt that should be shown when a field's answer is out of min/max range
     *
     */
    minMaxPrompt: {
      get () {
        const min = this.attr('field.min') || 'any'
        const max = this.attr('field.max') || 'any'
        return `(${min} --- ${max})`
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
      get: function () {
        let field = this.attr('field')
        let radioButtonValue = field.attr('value')
        let answerIndex = field.attr('_answer.answerIndex')
        let answerValues = field.attr('_answer.answer.values')
        let previousAnswer = answerValues[answerIndex]

        return (radioButtonValue === previousAnswer)
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
      get: function () {
        let name = this.attr('field.name').toLowerCase()
        let answerIndex = this.attr('%root.%root.rState.i') ? this.attr('%root.%root.rState.i') : 1
        let answers = this.attr('logic.interview.answers')
        if (name && answers) {
          return answers.attr(name).attr('values.' + answerIndex)
        }
      }
    },

    /**
     * @property {String} field.ViewModel.prototype.suggestionText suggestionText
     * @parent field.ViewModel
     *
     * Used to suggest input format for text strings
     *
     */

    suggestionText: {
      get: function () {
        let fieldType = this.field.type
        if (fieldType === 'numberssn') {
          return '999-99-9999'
        } else if (fieldType === 'numberphone') {
          return '(555) 555-5555'
        } else {
          return ''
        }
      }
    },

    /**
     * @property {Number} field.ViewModel.prototype.availableLength availableLength
     * @parent field.ViewModel
     *
     * remaining allowed characters before maxChar limit is reached
     *
     */
    availableLength: {
      value: undefined
    },

    /**
     * @property {Boolean} field.ViewModel.prototype.overCharacterLimit overCharacterLimit
     * @parent field.ViewModel
     *
     * used to trigger messages when over the maxChars value
     *
     */
    overCharacterLimit: {
      get () {
        return this.attr('availableLength') < 0
      }
    }
  },

  /**
     * @property {Number} field.ViewModel.prototype.calcAvailableLength suggestionText
     * @parent field.ViewModel
     *
     * Remaining character count
     *
     */

  calcAvailableLength (ev) {
    let maxChars = this.attr('field.maxChars')
    let availableLengthValue
    if (maxChars) {
      availableLengthValue = (maxChars - ev.target.value.length)
      this.attr('availableLength', availableLengthValue)
    }
    return availableLengthValue
  },

  /**
   * @property {Function} field.ViewModel.prototype.validateField validateField
   * @parent field.ViewModel
   *
   * validates a field for errors
   *
   */
  validateField (ctx, el) {
    const $el = $(el)
    let field = this.attr('field')
    let answer = field.attr('_answer')
    let value

    if (field.type === 'checkbox' || field.type === 'checkboxNOTA') {
      value = $el[0].checked
    } else {
      value = $el.val()
    }

    answer.attr('values', value)

    let errors = answer.errors.hasErrors()
    field.attr('hasError', !!errors)

    if (!errors) {
      let name = field.attr('name')
      let message = {}

      message[name] = [
        { format: 'var', msg: name },
        { msg: ' = ' },
        { format: 'val', msg: value }
      ]

      this.attr('traceLogic').push(message)
    }
  },

  preValidateNumber (ctx, el) {
    const $el = $(el)
    const field = this.attr('field')
    // accept only numbers, commas, periods, and negative sign
    const currentValue = $el.val()
    const scrubbedValue = currentValue.replace(/[^\d.,-]/g, '')
    if (currentValue !== scrubbedValue) {
      field.attr('hasError', true)
    } else {
      field.attr('hasError', false)
    }
  },

  /**
   * @property {Function} field.ViewModel.prototype.showCalculator showCalculator
   * @parent field.ViewModel
   *
   * shows input calculator
   *
   */
  showCalculator (field) {
    if (field && field.calculator === true) {
      let inputId = field.attr('label')
      let $inputEl = $("[id='" + inputId + "']")
      $inputEl.calculator({showOn: 'operator',
        eraseText: 'Clear',
        onClose: function (calcValue, instance) {
          instance.elem.prop('value', calcValue).change()
        }
      })
      $inputEl.calculator('show')
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
  convertDate (date, outputFormat, inputFormat) {
    inputFormat = inputFormat || ''
    outputFormat = outputFormat || 'MM/DD/YYYY'

    return (date && date !== 'TODAY') ? moment(date, inputFormat).format(outputFormat) : date
  },

  /**
   * @property {Function} field.ViewModel.prototype.validateDatepicker validateDatepicker
   * @parent field.ViewModel
   *
   * pre-formats datepicker dates
   *
   */
  validateDatepicker ($el) {
    let val = $el.val()
    let unformattedVal = this.convertDate(val, 'MM/DD/YYYY')
    $el.val(unformattedVal)

    this.validateField(null, $el)

    $el.val(val)
  },

  /*
   * @property {Function} field.ViewModel.prototype.expandTextlong expandTextlong
   * @parent field.ViewModel
   *
   * expands textlong field types into larger modal for easier editing
   * validateField needs to trigger here as the change event on the textlong.stache'
   * was interfering with the click event and vice versa. (see below)
   * https://stackoverflow.com/questions/20523313/jquery-change-sometimes-event-prevents-click-event
   *
   */
  expandTextlong (field) {
    const answerName = field.attr('name')
    const previewActive = this.attr('rState.previewActive')
    if (!answerName && previewActive) {
      this.attr('modalContent', {title: 'Author Warning', text: 'Text(long) fields require an assigned variable to expand'})
    }
    // handle skipped validation as per above
    if (answerName) {
      const $el = $('textarea[name="' + answerName + '"]')
      this.validateField(null, $el)

      const answerIndex = field.attr('_answer.answerIndex')
      const textlongValue = field._answer.attr('answer.values.' + answerIndex)
      const title = field.attr('label')
      this.attr('modalContent', {title, textlongValue, answerIndex, answerName})
    }
  },

  /**
   * default availableLength
   */
  init () {
    this.attr('availableLength', this.attr('field.maxChars'))
  }

})

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
export default Component.extend('FieldComponent', {
  view: template,
  tag: 'a2j-field',
  ViewModel: FieldVM,
  leakScope: true,

  events: {
    inserted () {
      let vm = this.viewModel
      if (vm.attr('field.type') === 'datemdy') {
        let defaultDate = vm.convertDate(vm.attr('field._answer.values')) || null
        // TODO: these dates need to be internationalized for output/input format
        // min/max values currently only come in as mm/dd/yyyy, or special value, TODAY, which is handled in convertDate above
        let minDate = vm.convertDate(vm.attr('field.min'), null, 'MM/DD/YYYY') || null
        let maxDate = vm.convertDate(vm.attr('field.max'), null, 'MM/DD/YYYY') || null
        let lang = vm.attr('lang')

        $('input.datepicker-input', $(this.element)).datepicker({
          defaultDate,
          minDate,
          maxDate,
          changeMonth: true,
          changeYear: true,
          yearRange: constants.kMinYear + ':' + constants.kMaxYear,
          monthNames: lang.MonthNamesLong.split(','),
          monthNamesShort: lang.MonthNamesShort.split(','),
          appendText: '(mm/dd/yyyy)',
          dateFormat: 'mm/dd/yy',
          onClose () {
            let $el = $(this)
            vm.validateDatepicker($el)
          }
        }).val(defaultDate)
      }
    },

    '{a2j-field input[type=checkbox]} change': function (values, ev) {
      let field = this.viewModel.attr('field')

      if (ev.target.checked === true && (field.type === 'checkbox' || field.type === 'checkboxNOTA')) {
        let fields = this.viewModel.attr('%root.fields')
        if (fields) {
          let toStayChecked = field.type
          fields.each(function (field) {
            if (field.type !== toStayChecked && (field.type === 'checkbox' || field.type === 'checkboxNOTA')) {
              field.attr('_answer.answer.values.1', false)
            }
          })
        }
      }
    },

    '{field._answer.answer.values} change': function (values, ev, attr) {
      if (attr === '1') {
        let message = {}
        let msgVar = this.viewModel.attr('field.name')
        message[msgVar] = [
          { format: 'var', msg: msgVar },
          { msg: ' = ' },
          { format: 'val', msg: values[attr] }
        ]
        this.viewModel.attr('traceLogic').push(message)
      }
    }
  },

  helpers: {
    selector (type, options) {
      type = typeof type === 'function' ? type() : type

      let self = this

      // TODO: CanJS should allow for passing helpers as well as scope.
      // This below is a copy of screenManager's eval helper.
      return views[type](options.scope, {
        eval (str) {
          str = typeof str === 'function' ? str() : str

          return self.attr('logic').eval(str)
        },

        dateformat (val, format) {
          val = val.isComputed ? val() : val
          format = format.isComputed ? format() : format
          return self.convertDate(val, format)
        },

        i18n (key) {
          key = typeof key === 'function' ? key() : key
          return self.attr('lang').attr(key) || key
        }
      })
    }
  }
})

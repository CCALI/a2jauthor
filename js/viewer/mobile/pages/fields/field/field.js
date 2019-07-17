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

import 'can-map-define'
import 'jquery-ui/ui/datepicker'

stache.registerPartial('invalid-prompt-tpl', invalidPromptTpl)
stache.registerPartial('exceeded-maxchars-tpl', exceededMaxcharsTpl)

/**
 * @property {can.Map} field.ViewModel
 * @parent <a2j-field>
 *
 * `<a2j-field>`'s viewModel.
 */
export const FieldVM = CanMap.extend('FieldVM', {
  define: {
    // passed in via fields.stache binding
    repeatVarValue: {},
    field: {},
    rState: {},

    /**
     * @property {Boolean} field.ViewModel.prototype.hasError hasError
     * @parent field.ViewModel
     *
     * Tracks if field has invalid answer based on constraints ie: min, max, required, etc
     */
    hasError: {},

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
        let defaultInvalidPrompt = this.attr('lang')['FieldPrompts_' + field.attr('type')]
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
        return `(${min} ~~~ ${max})`
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
        let answerIndex = this.attr('rState.answerIndex')
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
        let fieldType = this.attr('field.type')
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
    let _answer = field.attr('_answer')
    let value

    if (field.type === 'checkbox' || field.type === 'checkboxNOTA') {
      value = $el[0].checked
    } else {
      value = $el.val()
    }

    _answer.attr('values', value)

    let errors = _answer.attr('errors')
    field.attr('hasError', errors)

    if (!errors) {
      const name = field.attr('name')
      const answerIndex = _answer.attr('answerIndex')
      const isRepeating = _answer.attr('answer.repeating')
      // if repeating true, show var#count in debug-panel
      const displayAnswerIndex = isRepeating ? `#${answerIndex}` : ''
      let message = {
        key: name,
        fragments: [
          { format: 'var', msg: name + displayAnswerIndex },
          { format: '', msg: ' = ' },
          { format: 'val', msg: value }
        ]
      }
      this.attr('rState.traceMessage').addMessage(message)
    }

    return errors
  },

  /**
   * @property {Function} field.ViewModel.prototype.preValidateNumber preValidateNumber
   * @parent field.ViewModel
   *
   * number inputs use a normal text input and need to be pre-validated as text is entered
   *
   */
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
      const vm = this
      const inputId = field.attr('label')
      const $inputEl = $("[id='" + inputId + "']")
      $inputEl.calculator({ showOn: 'operator',
        eraseText: 'Clear',
        onClose: function (calcValue, instance) {
          const $el = instance.elem
          const vm = $el.prop('vm')
          const field = vm.attr('field')

          // set answer and validate
          field.attr('_answer.values', calcValue)
          vm.validateField(null, $el)
        }
      })
      $inputEl.prop('vm', vm)
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

    return (date && date.toUpperCase() !== 'TODAY') ? moment(date, inputFormat).format(outputFormat) : date
  },

  /*
   * @property {Function} field.ViewModel.prototype.expandTextlong expandTextlong
   * @parent field.ViewModel
   *
   * expands textlong field types into larger modal for easier editing
   *
   */
  expandTextlong (field) {
    const answerName = field.attr('name')
    const previewActive = this.attr('rState.previewActive')
    // warning modal only in Author
    if (!answerName && previewActive) {
      this.attr('modalContent', { title: 'Author Warning', text: 'Text(long) fields require an assigned variable to expand' })
    }
    if (answerName) {
      const title = field.attr('label')
      const textlongValue = field.attr('_answer.values')
      const textlongVM = this
      this.attr('modalContent', {
        title,
        textlongValue,
        answerName,
        field,
        textlongVM
      })
    }
  },

  fireModalClose (field, newValue, textlongVM) {
    field.attr('_answer.values', newValue)
    const selector = "[name='" + field.name + "']"
    const longtextEl = $(selector)[0]
    textlongVM.validateField(textlongVM, longtextEl)
  },

  /**
   * @property {Function} field.ViewModel.prototype.normalizeDateInput normalizeDateInput
   * @parent field.ViewModel
   *
   * allows date inputs like '010203', '01/02/03', '01022003', '01-02-03'
   * and reformats them to standard mm/dd/yyyy format
   * now checks for standard date separators to allow single digit dates, '4/2/19', '4-2-19'
   */
  normalizeDateInput (dateVal) {
    // preserve special value of 'TODAY'
    if (dateVal.toUpperCase() === 'TODAY') { return dateVal }

    // check for separators
    const hasSeparator = dateVal.match(/\/|-/g)
    let normalizedDate
    if (hasSeparator && hasSeparator.length === 2) {
      const separator = hasSeparator[0]
      const mdyArray = dateVal.split(separator)
      mdyArray.forEach((part, index) => {
        // don't correct single digit years
        if (part.length === 1 && index < 2) {
          mdyArray[index] = '0' + part
        }
      })
      // rebuild string date with leading zeros
      normalizedDate = mdyArray[0] + mdyArray[1] + mdyArray[2]
    } else {
      normalizedDate = dateVal.replace(/\/|-/g, '')
    }
    // legal dates will be 6 or 8 digits sans separators at this point, 010203 or 01022003
    if (normalizedDate.length === 8 || normalizedDate.length === 6) {
      const inputFormat = normalizedDate.length === 8 ? 'MMDDYYYY' : 'MMDDYY'
      normalizedDate = this.convertDate(normalizedDate, 'MM/DD/YYYY', inputFormat)
    }

    return normalizedDate
  },

  connectedCallback (el) {
    const vm = this

    // default availableLength
    vm.attr('availableLength', vm.attr('field.maxChars'))

    // setup datepicker widget
    if (vm.attr('field.type') === 'datemdy') {
      const defaultDate = vm.attr('field._answer.values')
        ? vm.normalizeDateInput(vm.attr('field._answer.values')) : null
      // TODO: these dates need to be internationalized for output/input format
      // min/max values currently only come in as mm/dd/yyyy, or special value, TODAY, which is handled in convertDate above
      const minDate = vm.convertDate(vm.attr('field.min'), null, 'MM/DD/YYYY') || null
      const maxDate = vm.convertDate(vm.attr('field.max'), null, 'MM/DD/YYYY') || null
      const lang = vm.attr('lang')

      $('input.datepicker-input', $(el)).datepicker({
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
        onClose (val, datepickerInstance) {
          const $el = $(this)
          // assure clean date format before validation
          const formattedDate = vm.normalizeDateInput($el.val())
          $el.val(formattedDate)
          vm.validateField(null, $el)
        }
      }).val(defaultDate)
    }
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
 *    {(trace-message)}="traceMessage" />
 * @codeend
 */
export default Component.extend('FieldComponent', {
  view: template,
  tag: 'a2j-field',
  ViewModel: FieldVM,
  leakScope: true,

  events: {
    '{a2j-field input[type=checkbox]} change': function (values, ev) {
      const field = this.viewModel.attr('field')

      if (ev.target.checked === true && (field.type === 'checkbox' || field.type === 'checkboxNOTA')) {
        const fields = field.attr('_answer.fields')
        if (fields) {
          const toStayChecked = field.type
          fields.forEach(function (field) {
            if (field.type !== toStayChecked && (field.type === 'checkbox' || field.type === 'checkboxNOTA')) {
              field.attr('_answer.values', false)
            }
          })
        }
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
          // TODO: should this always have a value, even empty string?
          if (!str) { return }
          str = typeof str === 'function' ? str() : str

          return self.attr('logic').eval(str)
        },

        dateformat (val, format) {
          return self.convertDate(val, format)
        },

        i18n (key) {
          key = typeof key === 'function' ? key() : key
          return self.attr('lang')[key] || key
        }
      })
    }
  }
})

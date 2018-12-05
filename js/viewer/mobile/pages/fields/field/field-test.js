import $ from 'jquery'
import stache from 'can-stache'
import { assert } from 'chai'
import { FieldVM } from './field'
import CanList from 'can-list'
import CanMap from 'can-map'
import sinon from 'sinon'

import 'steal-mocha'

describe('<a2j-field>', () => {
  describe('viewModel', () => {
    let vm
    let fieldStub

    beforeEach(() => {
      fieldStub = {
        name: 'Foo Input',
        type: '',
        suggestionText: '',
        _answer: {
          answerIndex: 1,
          answer: {
            values: [null]
          }
        }
      }

      vm = new FieldVM({
        field: fieldStub,
        traceLogic: new CanList()
      })
    })

    afterEach(() => {
      vm = null
    })

    it('shouldBeChecked works for radio types', () => {
      let values = vm.attr('field._answer.answer.values')
      values.push('bar')
      vm.attr('field.type', 'radio')
      vm.attr('field.value', 'bar')

      assert.equal(vm.attr('shouldBeChecked'), true, 'should return true if answer matches radio button value')
    })

    it('should suggest a format for SSN numbers', () => {
      vm.attr('field').attr('type', 'numberssn')

      assert.equal(vm.attr('suggestionText'), '999-99-9999', 'should return ssn format suggestion')
    })

    it('should suggest a format for Phone numbers', () => {
      vm.attr('field').attr('type', 'numberphone')

      assert.equal(vm.attr('suggestionText'), '(555) 555-5555', 'should return phone number format suggestion')
    })

    it('computes numberPickOptions from field min/max values', function () {
      vm.attr('field').attr({ min: '1', max: '5' })

      assert.deepEqual(
        vm.attr('numberPickOptions').serialize(),
        [1, 2, 3, 4, 5],
        'should return a range including end value'
      )

      // if min or max are not valid integers
      vm.attr('field').attr({ min: '', max: '' })
      assert.deepEqual(
        vm.attr('numberPickOptions').serialize(),
        [],
        'should return an empty list'
      )
    })

    it('validateField', () => {
      let el = $('<input name="Foo Input" type="text" />')

      $(el).val('bar value')
      vm.validateField(null, el)

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'Foo Input': [
          { format: 'var', msg: 'Foo Input' },
          { msg: ' = ' },
          { format: 'val', msg: 'bar value' }
        ]
      }], 'trace input value')

      $(el).val('baz value')
      vm.validateField(null, el)

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'Foo Input': [
          { format: 'var', msg: 'Foo Input' },
          { msg: ' = ' },
          { format: 'val', msg: 'bar value' }
        ]
      }, {
        'Foo Input': [
          { format: 'var', msg: 'Foo Input' },
          { msg: ' = ' },
          { format: 'val', msg: 'baz value' }
        ]
      }], 'trace updated input value')
    })

    it('convertDate', () => {
      assert.equal(vm.convertDate('2015-12-23'), '12/23/2015', 'should convert with default formats')
      assert.equal(vm.convertDate('2015/23/12', null, 'YYYY/DD/MM'), '12/23/2015', 'should convert with custom input format')
      assert.equal(vm.convertDate('2015-12-23', 'YYYY/DD/MM'), '2015/23/12', 'should convert with custom output format')
      assert.equal(vm.convertDate('2015/23/12', 'DD-MM-YY', 'YYYY/DD/MM'), '23-12-15', 'should convert with custom formats')
      assert.equal(vm.convertDate('TODAY'), 'TODAY', 'should keep TODAY')
    })

    it('invalidPrompt', () => {
      /* jshint ignore:start */
      vm.attr('lang', {
        FieldPrompts_checkbox: 'You must select one or more checkboxes to continue.',
        FieldPrompts_text: 'You must type a response in the highlighted space before you can continue.'
      })
      /* jshint ignore:end */

      vm.attr('field', {})

      vm.attr('field.hasError', false)
      assert.ok(!vm.attr('showInvalidPrompt'), 'showInvalidPrompt should be false when there is no error')

      vm.attr('field.hasError', true)
      assert.ok(!vm.attr('showInvalidPrompt'), 'showInvalidPrompt should be false when there is an error but no message')

      vm.attr('field.hasError', false)
      vm.attr('field.type', 'checkbox')
      vm.removeAttr('field.invalidPrompt')
      assert.equal(vm.attr('invalidPrompt'), vm.attr('lang.FieldPrompts_checkbox'), 'checkbox - should show the default error message')

      vm.attr('field.hasError', true)
      assert.ok(vm.attr('showInvalidPrompt'), 'checkbox - showInvalidPrompt should be true when there is an error and a default message')

      vm.attr('field.invalidPrompt', 'This is invalid')
      assert.equal(vm.attr('invalidPrompt'), 'This is invalid', 'checkbox - should show the custom error message')
      assert.ok(vm.attr('showInvalidPrompt'), 'checkbox - showInvalidPrompt should be true when there is an error and a default message')

      vm.attr('field.type', 'text')
      vm.removeAttr('field.invalidPrompt')
      assert.equal(vm.attr('invalidPrompt'), vm.attr('lang.FieldPrompts_text'), 'text - should show the default error message')
      assert.ok(vm.attr('showInvalidPrompt'), 'text - showInvalidPrompt should be true when there is an error and a default message')

      vm.attr('field.invalidPrompt', 'This is invalid')
      assert.equal(vm.attr('invalidPrompt'), 'This is invalid', 'text - should show the custom error message')
      assert.ok(vm.attr('showInvalidPrompt'), 'should be true when there is an error and a default message')
      assert.ok(vm.attr('showInvalidPrompt'), 'text - showInvalidPrompt should be true when there is an error and a default message')
    })

    it('minMaxPrompt should show or hide based on showMinMaxPrompt', function () {
      const field = vm.attr('field')

      field.attr({ 'type': 'number', 'min': null, 'max': null })
      assert.equal(vm.attr('showMinMaxPrompt'), false, 'if neither min/max has been set, showMinMaxPrompt should be false')

      field.attr('min', 5)
      assert.equal(vm.attr('showMinMaxPrompt'), true, 'if min exists, showMinMaxPrompt should be true')

      field.attr({ 'min': null, 'max': 15 })
      assert.equal(vm.attr('showMinMaxPrompt'), true, 'if max exists, showMinMaxPrompt should be true')
    })

    it('minMaxPrompt should show min and max values in range display', function () {
      const field = vm.attr('field')
      field.attr({ 'type': 'number', 'min': 5, 'max': 15 })
      assert.equal(vm.attr('minMaxPrompt'), '(5 --- 15)', 'should show the range of acceptable values')

      field.attr('min', null)
      assert.equal(vm.attr('minMaxPrompt'), '(any --- 15)', 'should show the word "any" if min or max value not set')
    })

    it('calcAvailableLength', function () {
      let ev = { target: { value: 'this is' } }
      let field = vm.attr('field')
      field.attr({ 'type': 'text', 'maxChars': undefined })

      vm.calcAvailableLength(ev)
      assert.equal(vm.attr('availableLength'), null, 'did not return undefined when maxChar not set')

      field.attr('maxChars', 10)
      vm.calcAvailableLength(ev)

      assert.equal(vm.attr('availableLength'), 3, 'did not compute remaining characters')
    })

    it('should detect when maxChar value is overCharacterLimit', function () {
      let ev = { target: { value: 'this is over the limit' } }
      let field = vm.attr('field')
      field.attr({
        'type': 'text',
        'maxChars': 10
      })
      vm.calcAvailableLength(ev)

      assert.equal(vm.attr('overCharacterLimit'), true, 'did not detect exceeding answer limit')
    })

    it('passes textlong answer to modal', function () {
      const field = vm.attr('field')
      field.attr('_answer.answer.values', [null, 'cash money'])
      field.attr({
        'type': 'textlong',
        'label': 'BigText'
      })

      vm.expandTextlong(field)
      const textlongValue = vm.attr('modalContent.textlongValue')
      assert.equal(textlongValue, 'cash money', 'should copy field answer value to modal')
    })
  })

  describe('Component', () => {
    let logicStub
    let checkboxDefaults, NOTADefaults, textDefaults, numberDollarDefaults
    let fields = new CanList()
    let langStub = new CanMap({
      MonthNamesShort: 'Jan, Feb',
      MonthNamesLong: 'January, February'
    })

    beforeEach(() => {
      logicStub = new CanMap({
        exec: $.noop,
        infinite: {
          errors: $.noop,
          reset: $.noop,
          _counter: 0,
          inc: $.noop
        },
        varExists: sinon.spy(),
        varCreate: sinon.spy(),
        varGet: sinon.stub(),
        varSet: sinon.spy(),
        eval: sinon.spy()
      })

      checkboxDefaults = {
        fields: fields,
        logic: logicStub,
        repeatVarValue: '',
        lang: langStub,
        traceLogic: new CanList(),
        name: 'Likes Chocolate TF',
        type: 'checkbox',
        label: 'Likes Chocolate',
        vm: new FieldVM({
          field: {
            name: 'Likes Chocolate TF',
            type: 'checkbox',
            label: 'Likes Chocolate',
            _answer: {
              answerIndex: 1,
              answer: {
                values: [null]
              }
            }
          },
          traceLogic: new CanList()
        })
      }

      NOTADefaults = {
        fields: fields,
        logic: logicStub,
        repeatVarValue: '',
        lang: langStub,
        traceLogic: new CanList(),
        name: 'None of the Above',
        type: 'checkboxNOTA',
        label: 'None of the Above',
        vm: new FieldVM({
          field: {
            name: 'None of the Above',
            type: 'checkboxNOTA',
            label: 'None of the Above',
            _answer: {
              answerIndex: 1,
              answer: {
                values: [null]
              }
            }
          },
          traceLogic: new CanList()
        })
      }

      textDefaults = {
        fields: fields,
        logic: logicStub,
        repeatVarValue: '',
        lang: langStub,
        traceLogic: new CanList(),
        name: 'Name',
        type: 'text',
        label: 'Name',
        vm: new FieldVM({
          field: {
            name: 'Name',
            type: 'text',
            label: 'Name',
            _answer: {
              answerIndex: 1,
              answer: {
                values: [null, 'Wilhelmina']
              }
            }
          },
          traceLogic: new CanList()
        })
      }

      numberDollarDefaults = {
        fields: fields,
        logic: logicStub,
        repeatVarValue: '',
        lang: langStub,
        traceLogic: new CanList(),
        name: 'Salary',
        type: 'numberdollar',
        label: 'Salary',
        vm: new FieldVM({
          field: {
            name: 'Salary',
            type: 'numberdollar',
            label: 'Salary',
            calculator: false,
            _answer: {
              answerIndex: 1,
              answer: {
                values: [null, 45678]
              }
            }
          },
          traceLogic: new CanList()
        })
      }

      // populate fields for this.viewModel.%root
      fields.push(checkboxDefaults.vm.attr('field'), NOTADefaults.vm.attr('field'), textDefaults.vm.attr('field'), numberDollarDefaults.vm.attr('field'))

      let checkboxFrag = stache(
        `<a2j-field
        vm:field:bind="vm.field"
        vm:lang:from="lang"
        vm:logic:bind="logic"
        vm:traceLogic:bind="traceLogic"
        vm:repeatVarValue:from="repeatVarValue" />`
      )

      let NOTAFrag = stache(
        `<a2j-field
        vm:field:bind="vm.field"
        vm:lang:from="lang"
        vm:logic:bind="logic"
        vm:traceLogic:bind="traceLogic"
        vm:repeatVarValue:from="repeatVarValue" />`
      )

      let textFrag = stache(
        `<a2j-field
        vm:field:bind="vm.field"
        vm:lang:from="lang"
        vm:logic:bind="logic"
        vm:traceLogic:bind="traceLogic"
        vm:repeatVarValue:from="repeatVarValue" />`
      )

      let numberDollarFrag = stache(
        `<a2j-field
        vm:field:bind="vm.field"
        vm:lang:from="lang"
        vm:logic:bind="logic"
        vm:traceLogic:bind="traceLogic"
        vm:repeatVarValue:from="repeatVarValue" />`
      )

      $('#test-area').html(checkboxFrag(checkboxDefaults)).append(numberDollarFrag(numberDollarDefaults)).append(NOTAFrag(NOTADefaults)).append(textFrag(textDefaults))
    })

    afterEach(() => {
      $('#test-area').empty()
    })

    describe('a2j-field input change', () => {
      it('should set other checkbox values to false when None of the Above is checked', () => {
        let checkbox = checkboxDefaults.vm.attr('field')
        checkbox.attr('_answer.answer.values.1', true)

        $("a2j-field [id='None of the Above']").prop('checked', true).change()

        assert.equal(checkbox.attr('_answer.values'), false, 'Checking NOTA clears other checkboxes')
      })

      it('should set checkboxNOTA value to false when another checkbox is checked', () => {
        let checkboxNOTA = NOTADefaults.vm.attr('field')
        checkboxNOTA.attr('_answer.answer.values.1', true)

        $("a2j-field [id='Likes Chocolate']").prop('checked', true).change()

        assert.equal(checkboxNOTA.attr('_answer.values'), false, 'Checking NOTA clears other checkboxes')
      })

      it('should not set any non checkbox style fields to false', () => {
        let checkbox = checkboxDefaults.vm.attr('field')
        checkbox.attr('_answer.answer.values.1', false)
        let textField = textDefaults.vm.attr('field')

        $("a2j-field [id='Likes Chocolate']").prop('checked', true).change()
        assert.equal(textField.attr('_answer.answer.values.1'), 'Wilhelmina', 'Checking checkbox does not change text field')
      })
    })

    describe('Calculator', () => {
      it('should show the calculator image when selected', () => {
        let numberDollarField = numberDollarDefaults.vm.attr('field')
        numberDollarField.attr('calculator', true)

        let $calcFound = $('.calc-icon')

        assert.equal($calcFound.attr('class'), 'calc-icon')
      })

      it('should not show the calculator image when unselected', () => {
        let $calcFound = $('.calc-icon')

        assert.equal($calcFound.attr('class'), undefined)
      })
    })
  })
})

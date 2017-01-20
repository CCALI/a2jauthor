import { FieldVM } from './field';
import assert from 'assert';
import List from 'can/list/';

import 'steal-mocha';

describe('<a2j-field>', () => {
  describe('viewModel', () => {
    let vm;
    let fieldStub;

    beforeEach(() => {
      fieldStub = {
        name: 'Foo Input',
        _answer: {
          answerIndex: 1,
          answer: {
            values: [null]
          }
        }
      };

      vm = new FieldVM({
        field: fieldStub,
        traceLogic: new List()
      });
    });

    afterEach(() => {
      vm = null;
    });

    it('shouldBeChecked', () => {
      let values = vm.attr('field._answer.answer.values');
      values.push('bar');
      vm.attr('field').attr('value', 'bar');

      assert(vm.attr('shouldBeChecked'), 'should return true if answer matches radio button value');
    });

    it('computes numberPickOptions from field min/max values', function() {
      vm.attr('field').attr({ min: '1', max: '5' });

      assert.deepEqual(
        vm.attr('numberPickOptions').serialize(),
        [1, 2, 3, 4, 5],
        'should return a range including end value'
      );

      // if min or max are not valid integers
      vm.attr('field').attr({ min: '', max: '' });
      assert.deepEqual(
        vm.attr('numberPickOptions').serialize(),
        [],
        'should return an empty list'
      );
    });

    it('validateField', () => {
      let el = $('<input name="Foo Input" type="text" />');

      $(el).val('bar value');
      vm.validateField(null, el);

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'Foo Input': [
          { format: 'var', msg: 'Foo Input' },
          { msg: ' = ' },
          { format: 'val', msg: 'bar value' }
        ]
      }], 'trace input value');

      $(el).val('baz value');
      vm.validateField(null, el);

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
      }], 'trace updated input value');
    });

    it('supportsNativeDateInput', () => {
      vm.attr('field', { type: 'foo' });
      assert(vm.attr('supportsNativeDateInput'), 'should return true for non-date input');

      vm.attr('field', { type: 'datemdy' });

      vm.attr('document', {
        createElement() {
          return {
            setAttribute(key, value) { this[key] = value; }
          };
        }
      });
      assert(!vm.attr('supportsNativeDateInput'), 'should return false when setAttribute does not sanitize value');

      vm.attr('document', {
        createElement() {
          return {
            setAttribute() {}
          };
        }
      });
      assert(vm.attr('supportsNativeDateInput'), 'should return true when setAttribute does not set value');
    });

    it('convertDate', () => {
      assert.equal(vm.convertDate('2015-12-23'), '12/23/2015', 'should convert with default formats');
      assert.equal(vm.convertDate('2015/23/12', null, 'YYYY/DD/MM'), '12/23/2015', 'should convert with custom input format');
      assert.equal(vm.convertDate('2015-12-23', 'YYYY/DD/MM'), '2015/23/12', 'should convert with custom output format');
      assert.equal(vm.convertDate('2015/23/12', 'DD-MM-YY', 'YYYY/DD/MM'), '23-12-15', 'should convert with custom formats');
      assert.equal(vm.convertDate('TODAY'), 'TODAY', 'should keep TODAY');
    });

    it('invalidPrompt', () => {
      /* jshint ignore:start */
      vm.attr('lang', {
        FieldPrompts_checkbox: 'You must select one or more checkboxes to continue.',
        FieldPrompts_text: 'You must type a response in the highlighted space before you can continue.',
      });
      /* jshint ignore:end */

      vm.attr('field', {});

      vm.attr('field.hasError', false);
      assert.ok(!vm.attr('showInvalidPrompt'), 'showInvalidPrompt should be false when there is no error');

      vm.attr('field.hasError', true);
      assert.ok(!vm.attr('showInvalidPrompt'), 'showInvalidPrompt should be false when there is an error but no message');

      vm.attr('field.hasError', false);
      vm.attr('field.type', 'checkbox');
      vm.removeAttr('field.invalidPrompt');
      assert.equal(vm.attr('invalidPrompt'), vm.attr('lang.FieldPrompts_checkbox'), 'checkbox - should show the default error message');

      vm.attr('field.hasError', true);
      assert.ok(vm.attr('showInvalidPrompt'), 'checkbox - showInvalidPrompt should be true when there is an error and a default message');

      vm.attr('field.invalidPrompt', 'This is invalid');
      assert.equal(vm.attr('invalidPrompt'), 'This is invalid', 'checkbox - should show the custom error message');
      assert.ok(vm.attr('showInvalidPrompt'), 'checkbox - showInvalidPrompt should be true when there is an error and a default message');

      vm.attr('field.type', 'text');
      vm.removeAttr('field.invalidPrompt');
      assert.equal(vm.attr('invalidPrompt'), vm.attr('lang.FieldPrompts_text'), 'text - should show the default error message');
      assert.ok(vm.attr('showInvalidPrompt'), 'text - showInvalidPrompt should be true when there is an error and a default message');

      vm.attr('field.invalidPrompt', 'This is invalid');
      assert.equal(vm.attr('invalidPrompt'), 'This is invalid', 'text - should show the custom error message');
      assert.ok(vm.attr('showInvalidPrompt'), 'should be true when there is an error and a default message');
      assert.ok(vm.attr('showInvalidPrompt'), 'text - showInvalidPrompt should be true when there is an error and a default message');
    });
  });
});

import { FieldVM } from './field';
import assert from 'assert';
import List from 'can/list/';

import 'steal-mocha';

describe('<a2j-field>', () => {
  describe('viewModel', () => {
    let vm, fieldStub;

    beforeEach(() => {
      fieldStub = {
        name: 'Foo Input',
        _answer: {}
      };

      vm = new FieldVM({
        field: fieldStub,
        traceLogic: new List
      });
    });

    afterEach(() => {
      vm = null;
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
    });
  });
});

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
  });
});

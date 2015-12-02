import { FieldVM } from './field';
import assert from 'assert';
import List from 'can/list/';

import 'steal-mocha';

describe('<a2j-field>', () => {
  describe('viewModel', () => {
    let vm, fieldStub;

    beforeEach(() => {
      fieldStub = {
        name: 'foo input',
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
      let el = $('<input name="foo input" type="text" />');

      $(el).val('bar value');
      vm.validateField(null, el);

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'foo input': [
          { format: 'var', msg: 'foo input' },
          { msg: ' = ' },
          { format: 'val', msg: 'bar value' }
        ]
      }], 'trace input value');

      $(el).val('baz value');
      vm.validateField(null, el);

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'foo input': [
          { format: 'var', msg: 'foo input' },
          { msg: ' = ' },
          { format: 'val', msg: 'bar value' }
        ]
      }, {
        'foo input': [
          { format: 'var', msg: 'foo input' },
          { msg: ' = ' },
          { format: 'val', msg: 'baz value' }
        ]
      }], 'trace updated input value');
    });
  });
});

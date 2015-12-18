import assert from 'assert';
import List from 'can/list/';
import VarPickerVM from './varpicker-vm';

import 'steal-mocha';

const variables = [
  { name: 'Foo Bar',
    repeating: false,
    values: [null]
  },
  { name: 'Bar Baz',
    repeating: false,
    values: [null]
  }
];

describe('<var-picker>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new VarPickerVM({variables});
    });

    it('generates a list of variable names', function() {
      let names = vm.attr('variableNames');

      assert.instanceOf(names, List);
      assert.include(names.attr(), 'Foo Bar');
      assert.include(names.attr(), 'Bar Baz');
    });
  });

});

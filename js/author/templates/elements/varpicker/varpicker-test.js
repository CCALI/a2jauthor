import assert from 'assert';
import List from 'can/list/';
import VarPickerVM from './varpicker-vm';
import A2JVariable from 'author/models/a2j-variable';

import 'steal-mocha';

const guideVars = {
  'foo bar': {
    name: 'Foo Bar',
    repeating: false,
    values: [null]
  },

  'bar baz': {
    name: 'Bar Baz',
    repeating: false,
    values: [null]
  }
};

describe('<var-picker>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new VarPickerVM({
        variables: guideVars
      });
    });

    it('converts guideVars to an A2JVariable list', function() {
      let variables = vm.attr('variables');
      assert.equal(variables.length, 2);
      assert.instanceOf(variables, A2JVariable.List);
    });

    it('generates a list of variable names', function() {
      let names = vm.attr('variableNames');

      assert.instanceOf(names, List);
      assert.include(names.attr(), 'Foo Bar');
      assert.include(names.attr(), 'Bar Baz');
    });
  });

});

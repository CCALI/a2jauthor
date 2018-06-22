import assert from 'assert';
import CanList from "can-list";
import VarPickerVM from './varpicker-vm';
import Variable from 'caja/author/models/a2j-variable';

import 'steal-mocha';

const variables = {
  childcounter: {
    name: 'ChildCounter',
    type: 'Number',
    repeating: false,
    values: [null, 3]
  },

  'first name': {
    name: 'First Name',
    type: 'Text',
    repeating: false,
    values: [null, 'John']
  },

  'child name': {
    name: 'Child Name',
    type: 'Text',
    repeating: true,
    values: [null, 'Bart', 'Lisa', 'Maggie']
  }
};

describe('<var-picker>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new VarPickerVM({
        variables: Variable.fromGuideVars(variables)
      });
    });

    it('variableNames - a list of variable names', function() {
      let names = vm.attr('variableNames');

      assert.instanceOf(names, CanList);
      assert.include(names.attr(), 'Child Name');
      assert.include(names.attr(), 'First Name');
      assert.include(names.attr(), 'ChildCounter');
    });

    it('filterTypes - array of types from a comma separated string', function() {
      vm.attr('filterTypes', 'number, Text');
      assert.deepEqual(vm.attr('filterTypes'), ['number', 'text']);
    });

    it('variables - list of variables filtered properly', function() {
      assert.deepEqual(vm.attr('filterTypes'), []);
      assert.equal(vm.attr('filterOcurrence'), 'any', 'default value');

      assert.equal(vm.attr('variables.length'), 3,
        'no filters set so it should have all variables');

      vm.attr('filterOcurrence', 'single');
      assert.equal(vm.attr('variables.length'), 2,
        'there are two non-repeating variables');

      vm.attr('filterTypes', 'text');
      assert.equal(vm.attr('variables.length'), 1,
        'there is only one non-repeating variable that is text');
      assert.equal(vm.attr('variables.0.name'), 'First Name');
    });
  });

});

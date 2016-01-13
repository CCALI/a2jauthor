import Map from 'can/map/';
import assert from 'assert';
import Answers from 'author/models/answers';
import {A2JVariableVM} from './a2j-variable';

import 'steal-mocha';

describe('<a2j-variable>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      let fixture = {
        'client first name': {
          values: [null],
          repeating: false,
          name: 'Client First Name'
        },

        'child name': {
          type: 'Text',
          repeating: true,
          name: 'Child Name',
          values: [null, 'Bart', 'Lisa', 'Maggie']
        }
      };

      vm = new A2JVariableVM({
        name: 'Client First Name',
        answers: new Answers(fixture)
      });
    });

    it('variable is undefined if no answer is available', function() {
      // Client Last Name has no key/val in answers.
      vm.attr('name', 'Client Last Name');
      assert.isUndefined(vm.attr('variable'));
    });

    it('gets variable object from answers if available', function() {
      let variable = vm.attr('variable');

      assert.isTrue(variable instanceof Map);
      assert.isFalse(variable.attr('repeating'));
      assert.equal(variable.attr('name'), 'Client First Name');
    });

    it('gets value for non repeating vars', function() {
      let variable = vm.attr('variable');

      variable.attr('repeating', false);
      variable.attr('values').push('John');

      assert.equal(vm.attr('value'), 'John');
    });

    it('gets value at given index for repeating vars', function() {
      vm.attr('name', 'child name');

      assert.isTrue(vm.attr('variable.repeating'));

      // the null at values[0] is dropped, and [varIndex] starts
      // at the next value in the array.
      vm.attr('varIndex', 0);
      assert.equal(vm.attr('value'), 'Bart');

      vm.attr('varIndex', 2);
      assert.equal(vm.attr('value'), 'Maggie');

      vm.attr('varIndex', 99);
      assert.isUndefined(vm.attr('value'));
    });

    // this applies to use case when no index is provided and the variable
    // has only one value (after dropping first null value).
    it('gets value at last index for repeating vars', function() {
      let variable = vm.attr('variable');

      variable.attr('repeating', true);
      variable.attr('values').push('John');

      assert.isNull(vm.attr('varIndex'));
      assert.isTrue(vm.attr('variable.repeating'));
      assert.deepEqual(variable.attr('values').attr(), [null, 'John']);

      assert.equal(vm.attr('value'), 'John');
    });

    // this applies for repeating variables with more than 2 values
    it('value is a comma separated string if index is not provided', function() {
      vm.attr('name', 'child name');

      assert.isNull(vm.attr('varIndex'));
      assert.isTrue(vm.attr('variable.repeating'));

      assert.equal(vm.attr('value'), 'Bart, Lisa and Maggie');
    });
  });

});

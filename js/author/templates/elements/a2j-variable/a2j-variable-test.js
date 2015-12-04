import Map from 'can/map/';
import assert from 'assert';
import {A2JVariableVM} from './a2j-variable';

describe('<a2j-variable>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      let answers = new Map({
        'client first name': {
          values: [null],
          repeating: false,
          name: 'Client First Name'
        }
      });

      vm = new A2JVariableVM({
        answers,
        name: 'Client First Name'
      });
    });

    it('variable is undefined if it has no answer', function() {
      // Client Last Name has no key/val in answers.
      vm.attr('name', 'Client Last Name');
      assert.isUndefined(vm.attr('variable'));
    });

    it('gets variable object from answers if provided', function() {
      let variable = vm.attr('variable');

      assert.isTrue(variable instanceof Map);
      assert.isFalse(variable.attr('repeating'));
      assert.equal(variable.attr('name'), 'Client First Name');
    });

    it('value is a comma delimited string for repeating vars', function() {
      let variable = vm.attr('variable');

      variable.attr('repeating', true);
      variable.attr('values').push('foo', 'bar', 'baz');

      assert.equal(vm.attr('value'), 'foo, bar and baz');
    });

    it('value is 2nd element in values for non repeating vars', function() {
      let variable = vm.attr('variable');

      variable.attr('repeating', false);
      variable.attr('values').push('John');

      assert.equal(vm.attr('value'), 'John');
    });
  });

});

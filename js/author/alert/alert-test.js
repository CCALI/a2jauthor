import assert from 'assert';
import {Alert} from './alert';

import 'steal-mocha';

describe('<app-alert>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new Alert();
    });

    it('defaults transitionTime to 5000ms', function() {
      assert.equal(vm.attr('transitionTime'), 5000);
    });

    it('sets "open" back to "false" after "transitionTime"', function(done) {
      let delay = 0;

      vm.attr('transitionTime', delay);
      vm.attr('open', true);

      assert.isTrue(vm.attr('open'), 'should be opened');

      setTimeout(function() {
        assert.isFalse(vm.attr('open'), 'should not be opened');
        done();
      }, delay);
    });
  });

});

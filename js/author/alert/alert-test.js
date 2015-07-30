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

    it('sets state back to closed after transitionTime if set to opened', function(done) {
      let delay = 0;

      vm.attr('transitionTime', delay);
      vm.attr('state', 'opened');

      assert.equal(vm.attr('state'), 'opened', 'should be opened');

      setTimeout(function() {
        assert.equal(vm.attr('state'), 'closed', 'should be closed');
        done();
      }, delay);
    });
  });

});

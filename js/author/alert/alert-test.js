import assert from 'assert';
import {Alert} from './alert';
import stache from 'can/view/stache/';

import 'steal-mocha';

describe('<app-alert>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new Alert();
    });

    it('defaults autoClose to false', function() {
      assert.isFalse(vm.attr('autoClose'));
    });

    it('is not dismissible by default', function() {
      assert.isFalse(vm.attr('dismissible'));
    });

    it('defaults autoCloseTime to 5000ms', function() {
      assert.equal(vm.attr('autoCloseTime'), 5000);
    });

    it('sets "open" back to "false" if "autoClose" is true', function(done) {
      let delay = 0;

      vm.attr('autoClose', true);
      vm.attr('autoCloseTime', delay);
      vm.attr('open', true);

      assert.isTrue(vm.attr('open'), 'should be opened');
      assert(vm.attr('autoCloseTimeoutId'), 'a timeout should be set');

      setTimeout(function() {
        assert.isFalse(vm.attr('open'), 'should not be opened');
        done();
      }, delay);
    });
  });

  describe('Component', function() {
    beforeEach(function() {
      let frag = stache('<app-alert open="true"></app-alert>');
      $('#test-area').html(frag());
    });

    afterEach(() => $('#test-area').empty());

    it('is visible if open is true', function() {
      assert($('app-alert').is(':visible'));
    });

    it('a close button is visible if dismissible', function() {
      $('app-alert').viewModel().attr('dismissible', true);
      assert($('.alert').hasClass('alert-dismissible'));
      assert($('button.close').is(':visible'));
    });
  });

});

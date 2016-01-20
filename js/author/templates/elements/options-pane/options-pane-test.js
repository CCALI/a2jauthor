import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';

import 'steal-mocha';
import './options-pane';

describe('element-options-pane', function() {

  describe('Component', function() {
    let vm;

    beforeEach(function() {
      let frag = stache('<element-options-pane />');

      $('#test-area').html(frag());
      vm = $('element-options-pane').viewModel();
    });

    it('shows "Save & Close" button by default', function() {
      assert($('.btn-save').length, 'it should be visible');
    });

    it('hides button is "showSaveButton" is set to false', function() {
      vm.attr('showSaveButton', false);

      assert.lengthOf($('.btn-save'), 0, 'it should not be in the DOM');
    });
  });

});

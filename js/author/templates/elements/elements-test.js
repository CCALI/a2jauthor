import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';

import './elements';
import 'steal-mocha';

describe('template-elements', function() {

  describe('Component', function() {
    beforeEach(function() {
      let frag = stache(
        '<template-elements></template-elements'
      );
      $('#test-area').html(frag());
    });

    afterEach(() => $('#test-area').empty());

    it('renders blank-element when elements is empty', function() {
      let vm = $('template-elements').viewModel();

      assert.equal(vm.attr('elements.length'), 0, 'elements is empty');
      assert($('blank-element').length, 'blank-element should have been rendered');
    });
  });

});

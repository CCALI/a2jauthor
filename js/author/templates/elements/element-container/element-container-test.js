import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';

import 'steal-mocha';
import './element-container';

describe('<element-container>', function() {

  describe('Component', function() {
    beforeEach(function() {
      let frag = stache(
        `<element-container>
          <h2>SectionTitle</h2>
        </element-container>`
      );

      $('#test-area').html(frag());
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it.skip('sets "selected" to "true" on click', function() {
      let vm = $('element-container').viewModel();
      assert.isFalse(vm.attr('selected'), 'should default to false');

      $('.wrapper').click();
      assert.isTrue(vm.attr('selected'));
    });

    it('hides element-toolbar if not selected', function() {
      let vm = $('element-container').viewModel();

      assert.isFalse(vm.attr('selected'), 'should default to false');
      assert(!$('element-toolbar').length, 'element-toolbar should not be rendered');
    });

    it('shows element-toolbar if selected', function() {
      let vm = $('element-container').viewModel();

      vm.attr('selected', true);
      assert($('element-toolbar').length, 'should be visible');
    });
  });

});

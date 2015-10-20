import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';

import './edit';
import 'steal-mocha';
import '../elements/a2j-template/';

describe('template-edit-page', function() {

  describe.skip('Component', function() {
    beforeEach(function() {
      let frag = stache(
        '<template-edit-page template-id="new"></template-edit-page>'
      );
      $('#test-area').html(frag());
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('renders blank-element when template is empty', function() {
      let vm = $('template-edit-page').viewModel();
      let a2jTemplatePromise = vm.attr('a2jTemplatePromise');

      return a2jTemplatePromise.then(function(a2jTemplate) {
        let totalChildren = a2jTemplate.attr('rootNode.children.length');

        assert.equal(totalChildren, 0, 'new templates have no children');
        assert($('blank-element').length, 'blank-element should be rendered');
        assert(!$('a2j-template').length, 'a2j-template should not be rendered');
      });
    });

    it('renders a2j-template when template has elements', function() {
      let vm = $('template-edit-page').viewModel();

      vm.attr('templateId', 2112);

      let a2jTemplatePromise = vm.attr('a2jTemplatePromise');

      return a2jTemplatePromise.then(function(a2jTemplate) {
        let totalChildren = a2jTemplate.attr('rootNode.children.length');

        assert.isTrue(totalChildren > 0, 'template has elements');
        assert($('a2j-template').length, 'a2j-template should be rendered');
        assert(!$('blank-element').length, 'blank-element should not be rendered');
      });
    });
  });

});

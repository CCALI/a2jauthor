import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';

import './edit';
import 'steal-mocha';
import '../elements/a2j-template/';

describe('template-edit-page', function() {

  describe('Component', function() {
    let vm;

    beforeEach(function() {
      let frag = stache('<template-edit-page template-id="2113" />');
      $('#test-area').html(frag());
      vm = $('template-edit-page').viewModel();
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('renders a2j-template when template has elements', function() {
      let templatePromise = vm.attr('a2jTemplatePromise');

      return templatePromise.then(function(template) {
        let totalChildren = template.attr('rootNode.children.length');

        assert.isTrue(totalChildren > 0, 'template has elements');
        assert($('a2j-template').length, 'a2j-template should be rendered');
        assert(!$('a2j-blank-template').length, 'it should not be rendered');
      });
    });

    it('renders a2j-blank-template when template has no elements', function() {
      let vm = $('template-edit-page').viewModel();
      let templatePromise = vm.attr('a2jTemplatePromise');

      return templatePromise.then(function(template) {
        let children = template.attr('rootNode.children');

        // replace children with empty list.
        children.replace([]);

        assert.equal(children.attr('length'), 0, 'it should be empty');
        assert($('a2j-blank-template').length, 'it should be rendered');
        assert(!$('a2j-template').length, 'a2j-template should not be rendered');
      });
    });
  });

});

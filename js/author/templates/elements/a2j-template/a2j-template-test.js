import $ from 'jquery';
import F from 'funcunit';
import assert from 'assert';
import stache from 'can/view/stache/';
import A2JTemplate from 'author/models/a2j-template';
import templateFixture from 'author/models/fixtures/templates/guide20-template2114';

import 'steal-mocha';
import './a2j-template';

describe('a2j-template', function() {

  describe('Component', function() {
    let vm;

    beforeEach(function() {
      const rootNode = A2JTemplate.makeDocumentTree(templateFixture.rootNode);
      const template = new A2JTemplate();

      template.attr('rootNode', rootNode);

      const frag = stache(
        '<a2j-template edit-enabled="true" {(template)}="template" />'
      );

      $('#test-area').html(frag({ template }));
      vm = $('a2j-template').viewModel();
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    describe('only one element can be selected at a time', function() {
      this.timeout(5000);

      it('selecting direct descendants', function(done) {
        const firstElementVM = $('element-container').eq(0).viewModel();
        const secondElementVM = $('element-container').eq(1).viewModel();

        F('element-options-pane').size(0, 'no element selected');

        // click the first element
        F('element-container:nth(0) .wrapper').click();

        F(function() {
          assert.isTrue(firstElementVM.attr('selected'), 'first element should be selected');
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected');
        });

        // there should be only one options pane on screen
        F('element-options-pane').size(1);

        // click the second element
        F('element-container:nth(1) .wrapper').click();

        F(function() {
          assert.isTrue(secondElementVM.attr('selected'), 'second element should be selected');
          assert.isFalse(firstElementVM.attr('selected'), 'first element should not be selected');
        });

        // there should be only one options pane on screen
        F('element-options-pane').size(1);

        F(done);
      });

      it('selecting nested child then a direct descendant', function(done) {
        const firstElementVM = $('element-container').eq(0).viewModel();
        const secondElementVM = $('element-container').eq(1).viewModel();
        const nestedChildVM = $('conditional-add-element').eq(0).viewModel();

        // click conditional add element (add ot if inside a2j-conditional)
        F('conditional-add-element > div').click();

        F(function() {
          assert.isTrue(nestedChildVM.attr('selected'), 'nested child should be selected');
          assert.isFalse(firstElementVM.attr('selected'), 'first element should not be selected');
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected');
        });

        // there should be only one options pane on screen
        F('element-options-pane').size(1);

        // click the first element
        F('element-container:nth(0) .wrapper').click();

        F(function() {
          assert.isTrue(firstElementVM.attr('selected'), 'first element should be selected');
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected');
          assert.isFalse(nestedChildVM.attr('selected'), 'nested child should not be selected');
        });

        // there should be only one options pane on screen
        F('element-options-pane').size(1);

        F(done);
      });

      it('selecting a direct descendant then a nested child', function(done) {
        const firstElementVM = $('element-container').eq(0).viewModel();
        const secondElementVM = $('element-container').eq(1).viewModel();
        const nestedChildVM = $('conditional-add-element').eq(0).viewModel();

        // click the first element
        F('element-container:nth(0) .wrapper').click();

        F(function() {
          assert.isTrue(firstElementVM.attr('selected'), 'first element should be selected');
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected');
          assert.isFalse(nestedChildVM.attr('selected'), 'nested child should not be selected');
        });

        // there should be only one options pane on screen
        F('element-options-pane').size(1);

        // click conditional add element (add to if inside a2j-conditional)
        F('conditional-add-element > div').click();

        F(function() {
          assert.isTrue(nestedChildVM.attr('selected'), 'nested child should be selected');
          assert.isFalse(firstElementVM.attr('selected'), 'first element should not be selected');
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected');
        });

        // there should be only one options pane on screen
        F('element-options-pane').size(1);

        F(done);
      });
    });
  });

});

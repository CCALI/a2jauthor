import $ from 'jquery';
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
      let template = new A2JTemplate(templateFixture);

      let frag = stache(
        '<a2j-template edit-enabled="true" {(template)}="template" />'
      );

      $('#test-area').html(frag({ template }));
      vm = $('a2j-template').viewModel();
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    describe('only one element can be selected at a time', function() {
      it('works when selecting child elements (direct descendants)', function() {
        assert.lengthOf($('element-options-pane'), 0, 'no element selected');

        let $firstElement = $('element-container').eq(0);
        let $secondElement = $('element-container').eq(1);

        $firstElement.find('.wrapper').click();
        assert.isTrue($firstElement.viewModel().attr('selected'));
        assert.isFalse($secondElement.viewModel().attr('selected'));
        assert.lengthOf($('element-options-pane'), 1);

        $secondElement.find('.wrapper').click();
        assert.isTrue($secondElement.viewModel().attr('selected'));
        assert.isFalse($firstElement.viewModel().attr('selected'));
        assert.lengthOf($('element-options-pane'), 1);
      });

      it('works when selecting nested child -> direct child', function() {
        let $firstElement = $('element-container').eq(0);
        let $secondElement = $('element-container').eq(1);
        let $nestedChild = $('conditional-add-element').eq(0);

        $nestedChild.find('> div').click();
        assert.isFalse($firstElement.viewModel().attr('selected'));
        assert.isFalse($secondElement.viewModel().attr('selected'));
        assert.isTrue($nestedChild.viewModel().attr('editActive'));
        assert.lengthOf($('element-options-pane'), 1);

        $firstElement.find('.wrapper').click();
        assert.isTrue($firstElement.viewModel().attr('selected'));
        assert.isFalse($secondElement.viewModel().attr('selected'));
        assert.isFalse($nestedChild.viewModel().attr('editActive'));
        assert.lengthOf($('element-options-pane'), 1);
      });

      it('works when selecting direct child -> nested child', function() {
        let $firstElement = $('element-container').eq(0);
        let $secondElement = $('element-container').eq(1);
        let $nestedChild = $('conditional-add-element').eq(0);

        $firstElement.find('.wrapper').click();
        assert.isTrue($firstElement.viewModel().attr('selected'));
        assert.isFalse($secondElement.viewModel().attr('selected'));
        assert.isFalse($nestedChild.viewModel().attr('editActive'));
        assert.lengthOf($('element-options-pane'), 1);

        $nestedChild.find('> div').click();
        assert.isFalse($firstElement.viewModel().attr('selected'));
        assert.isFalse($secondElement.viewModel().attr('selected'));
        assert.isTrue($nestedChild.viewModel().attr('editActive'));
        assert.lengthOf($('element-options-pane'), 1);
      });
    });
  });

});

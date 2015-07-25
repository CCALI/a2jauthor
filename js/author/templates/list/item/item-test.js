import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';
import Template from 'author/models/template';

import './item';
import 'steal-mocha';

describe('<templates-list-item>', function() {

  describe('Component', function() {
    let template;

    beforeEach(function() {
      template = new Template({
        active: true,
        buildOrder: 1,
        lastModified: '',
        title: 'Foo bar baz',
        description: 'Lorem ipsum dolor sit amet, homero salutandi te sea'
      });

      let frag = stache(
        '<templates-list-item template="{template}"></templates-list-item>'
      );
      $('#test-area').html(frag({template}));
    });

    afterEach(() => $('#test-area').empty());

    it('shows/hides delete link on hover for active templates', function() {
      assert.isTrue(template.attr('active'), 'should be active');

      $('.template-details').mouseenter();
      assert.isTrue($('.delete').is(':visible'), 'should be visible');

      $('.template-details').mouseleave();
      assert.isFalse($('.delete').is(':visible'), 'should be hidden');
    });

    it('shows/hides restore link on hover for deleted templates', function() {
      template.attr('active', false);
      assert.isFalse(template.attr('active'), 'should be deleted');

      $('.template-details').mouseenter();
      assert.isTrue($('.restore').is(':visible'), 'should be visible');

      $('.template-details').mouseleave();
      assert.isFalse($('.restore').is(':visible'), 'should be hidden');
    });
  });

});

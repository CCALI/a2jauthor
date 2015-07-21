import $ from 'jquery';
import assert from 'assert';
import stache from 'can/view/stache/';
import Template from 'author/models/template';

import './item';
import 'steal-mocha';

describe('<templates-list-item>', function() {

  describe('Component', function() {
    beforeEach(function() {
      let template = new Template({
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

    it('shows/hides delete link on mouseenter/mouseleave', function() {
      $('.template-details').mouseenter();
      assert.isTrue($('.delete').is(':visible'));

      $('.template-details').mouseleave();
      assert.isFalse($('.delete').is(':visible'));
    });
  });

});

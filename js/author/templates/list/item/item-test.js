import $ from 'jquery';
import assert from 'assert';
import {Item} from './item';
import stache from 'can/view/stache/';
import Template from 'author/models/template';

import 'steal-mocha';

describe('<templates-list-item>', function() {
  let vm;

  describe('viewModel', function() {
    beforeEach(function() {
      vm = new Item({
        template: new Template()
      });
    });

    it('defaults transitionTime to 1000ms', function() {
      assert.equal(vm.attr('transitionTime'), 1000);
    });

    it('defaults deleting to false', function() {
      assert.isFalse(vm.attr('deleting'));
    });

    it('defaults restoring to false', function() {
      assert.isFalse(vm.attr('restoring'));
    });

    it('deleteTemplate works', function(done) {
      let delay = 0;
      let template = vm.attr('template');

      // sensible defaults
      template.attr('active', true);
      template.attr('deleted', false);
      vm.attr('transitionTime', delay);

      vm.deleteTemplate();
      assert.isTrue(vm.attr('deleting'), 'should be true');
      assert.isTrue(template.attr('deleted'), 'deleted flag should be true');
      assert.isTrue(template.attr('active'), 'should still be active to give time to animate out');

      setTimeout(function() {
        assert.isFalse(vm.attr('deleting'), 'should be reset to false');
        assert.isFalse(template.attr('active'), 'after transitionTime it should be false');
        done();
      }, delay);
    });

    it('restoreTemplate works', function(done) {
      let delay = 0;
      let template = vm.attr('template');

      // sensible defaults
      template.attr('active', false);
      template.attr('restored', false);
      vm.attr('transitionTime', delay);

      vm.restoreTemplate();
      assert.isTrue(vm.attr('restoring'), 'should be true');
      assert.isTrue(template.attr('restored'), 'restored flag should be true');
      assert.isFalse(template.attr('active'), 'should still appear as deleted');

      setTimeout(function() {
        assert.isFalse(vm.attr('restoring'), 'should be reset to false');
        assert.isTrue(template.attr('active'), 'after transitionTime it should be true');
        done();
      }, delay);
    });
  });

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

      $('.template-wrapper').mouseenter();
      assert.isTrue($('.delete').is(':visible'), 'should be visible');

      $('.template-wrapper').mouseleave();
      assert.isFalse($('.delete').is(':visible'), 'should be hidden');
    });

    it('shows/hides restore link on hover for deleted templates', function() {
      template.attr('active', false);
      assert.isFalse(template.attr('active'), 'should be deleted');

      $('.template-wrapper').mouseenter();
      assert.isTrue($('.restore').is(':visible'), 'should be visible');

      $('.template-wrapper').mouseleave();
      assert.isFalse($('.restore').is(':visible'), 'should be hidden');
    });
  });

});

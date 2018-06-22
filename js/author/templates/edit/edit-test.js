import $ from 'jquery';
import assert from 'assert';
import stache from "can-stache";
import { TemplateEditPageVM } from './edit';

import 'steal-mocha';
import '../elements/a2j-template/';

describe('template-edit-page', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      localStorage.clear();

      vm = new TemplateEditPageVM({
        templateId: 'new'
      });
    });

    afterEach(function() {
      localStorage.clear();
    });

    it('saves new templates automatically and sets new id', function(done) {
      assert.equal(vm.attr('templateId'), 'new');
      // a2j-template model findOne requires fixture guideId
      vm.attr('guideId', "1261");

      vm.bind('a2jTemplate', function() {
        const templateId = vm.attr('a2jTemplate.templateId');

        assert.equal(vm.attr('action'), 'edit');
        assert.equal(vm.attr('templateId'), templateId, 'same as a2jTemplate');
        assert(vm.attr('a2jTemplate.templateId') > 3000, 'fixture starts id sequence at 3000');

        vm.unbind('a2jTemplate');
        done();
      });
    });
  });

  describe('Component', function() {
    let vm;

    beforeEach(function() {
      // a2j-template model findOne requires fixture guideId
      let frag = stache('<template-edit-page template-id="2113" guide-id="1261"/>');
      $('#test-area').html(frag());
      vm = $('template-edit-page').viewModel();
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('renders a2j-template when template has elements', function(done) {
      vm.bind('a2jTemplate', function(ev, template) {
        let totalChildren = template.attr('rootNode.children.length');

        assert.isTrue(totalChildren > 0, 'template has elements');

        setTimeout(() => {
          assert($('a2j-template').length, 'a2j-template should be rendered');
          assert(!$('a2j-blank-template').length, 'it should not be rendered');

          done();
        }, 0);
      });
    });

    it('renders a2j-blank-template when template has no elements', function(done) {
      vm.bind('a2jTemplate', function(ev, template) {
        let children = template.attr('rootNode.children');

        // replace children with empty list.
        children.replace([]);

        assert.equal(children.attr('length'), 0, 'it should be empty');
        setTimeout(() => {
          assert($('a2j-blank-template').length, 'it should be rendered');
          assert(!$('a2j-template').length, 'a2j-template should not be rendered');

          done();
        }, 0);
      });
    });
  });

});

import F from 'funcunit';
import assert from 'assert';
import {Templates} from './templates';

import 'can/route/';
import 'steal-mocha';

describe('<templates-page>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new Templates();
    });

    it('defaults activeFilter to \'active\' status', function() {
      assert.equal(vm.attr('activeFilter'), 'active');
    });

    it('defaults sortCriteria to buildOrder asc', function() {
      assert.deepEqual(vm.attr('sortCriteria').attr(), {
        key: 'buildOrder',
        direction: 'asc'
      });
    });
  });

  describe('Component', function() {
    beforeEach(function() {
      let frag = can.view.stache(
        '<templates-page></templates-page>'
      );
      $('#test-area').html(frag());
    });

    afterEach(() => $('#test-area').empty());

    it('renders a list of active templates by default', function(done) {
      F('templates-list-item').size(size => size > 0);

      F(function() {
        let templates = $('templates-page').viewModel().attr('displayList');
        let deleted = templates.filter(template => !template.attr('active'));
        assert.equal(deleted.attr('length'), 0, 'should not have deleted templates');
      });

      F(done);
    });

    it('rendered list is sorted by buildOrder asc by default', function(done) {
      F('templates-list-item').size(size => size > 0);

      F(function() {
        let templates = $('templates-page').viewModel().attr('displayList');
        let buildOrder = templates.attr().map(template => template.buildOrder);
        assert.deepEqual(buildOrder, [1, 2, 3, 4], 'should be sorted asc');
      });

      F(done);
    });

    it('deleted templates are filtered out properly', function(done) {
      let delay = 0;
      let totalActive;

      // wait for the list to be rendered
      F('templates-list-item').size(size => size > 0);

      F(function() {
        totalActive = $('templates-list-item').length;

        // set transition time to 0ms, to speed up the test
        $('templates-list').viewModel().attr('itemTransitionTime', delay);

        // set hovered to true to display the delete template link
        $('templates-list-item').first().viewModel().attr('hovered', true);
      });

      F('templates-list-item .delete').size(1, 'delete link should be on screen');

      F('templates-list-item .delete').click();

      F(function() {
        let current = $('templates-list-item').length;
        assert.equal(current, totalActive - 1, 'there should be one less');
      });

      F(done);
    });
  });

});

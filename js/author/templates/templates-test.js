import F from 'funcunit';
import Map from 'can/map/';
import assert from 'assert';
import Templates from './templates-vm';

import 'can/route/';
import 'steal-mocha';
import './templates';

describe('<templates-page>', function() {

  describe('viewModel', function() {
    let vm;

    beforeEach(function() {
      vm = new Templates({
        appState: new Map()
      });
    });

    it('defaults activeFilter to "active" status', function() {
      assert.equal(vm.attr('activeFilter'), 'active');
    });

    it('defaults "sortCriteria" to "buildOrder" asc', function() {
      assert.deepEqual(vm.attr('sortCriteria').attr(), {
        key: 'buildOrder',
        direction: 'asc'
      });
    });
  });

  describe('Component', function() {
    beforeEach(function(done) {
      let appState = new Map({guideId: 1255});

      let frag = can.view.stache(
        '<templates-page app-state="{appState}"></templates-page>'
      );

      $('#test-area').html(frag({appState}));

      F('templates-list-item').size(size => size > 0);
      F(done);
    });

    afterEach(function() {
      $('#test-area').empty();
    });

    it('renders a list of active templates by default', function(done) {
      F(function() {
        let templates = $('templates-page').viewModel().attr('displayList');
        let deleted = templates.filter(template => !template.attr('active'));
        assert.equal(deleted.attr('length'), 0, 'should not have deleted templates');
      });

      F(done);
    });

    it('rendered list is sorted by buildOrder asc by default', function(done) {
      F(function() {
        let templates = $('templates-page').viewModel().attr('displayList');
        let buildOrder = templates.attr().map(template => template.buildOrder);
        assert.deepEqual(buildOrder, [1, 2], 'should be sorted asc');
      });

      F(done);
    });

    it.skip('deleted templates are filtered out properly', function(done) {
      let delay = 0;
      let totalActive;

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

    it('displays alert if there are no search results', function(done) {
      F(function() {
        $('templates-page').viewModel().attr('searchToken', '123456789');
      });

      F('templates-list-item').size(0);
      F('.no-results').visible('no results message should be visible');
      F(done);
    });

    it('displays alert if there are no templates', function(done) {
      // replace component's template list with an empty array.
      F(function() {
        $('templates-page').viewModel().attr('templates').replace([]);
      });

      F('.no-templates-exist').visible('no templates message should be visible');
      F(done);
    });

    it('displays alert if no templates match filters', function(done) {
      F(function() {
        let vm = $('templates-page').viewModel();

        // mark all templates as deleted
        vm.attr('templates').each(template => template.attr('active', false));
      });

      F('.no-match-filter').visible('no templates match "active" filter');
      F('.no-match-filter').text(/no templates match/i);
      F(done);
    });

    it('displays alert if there are no templates in the trash', function(done) {
      F(function() {
        let vm = $('templates-page').viewModel();

        // mark all templates as active and set filter to deleted.
        vm.attr('templates').each(template => template.attr('active', true));
        vm.attr('activeFilter', 'deleted');
      });

      F('.no-match-filter').visible('no templates match "active" filter');
      F('.no-match-filter').text(/no templates in the trash/i);
      F(done);
    });
  });

});

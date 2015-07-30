import F from 'funcunit';
import assert from 'assert';
import {Templates} from './templates';

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
  });

});

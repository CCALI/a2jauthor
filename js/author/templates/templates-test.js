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

    it('displayList - should contain only active templates by default', function() {
      return vm.attr('displayList').then(function(templates) {
        let deleted = templates.filter(template => !template.attr('active'));
        assert.equal(deleted.attr('length'), 0, 'should not have deleted templates');
      });
    });

    it('displayList - should be sorted by buildOrder asc by default', function() {
      return vm.attr('displayList').then(function(templates) {
        let buildOrder = templates
          .filter(template => template.attr('active')).attr()
          .map(template => template.buildOrder);

        assert.deepEqual(buildOrder, [1, 2, 3, 4]);
      });
    });
  });

});

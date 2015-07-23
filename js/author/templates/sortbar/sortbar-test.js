import assert from 'assert';
import {Sortbar} from './sortbar';

import 'steal-mocha';

describe('<templates-sortbar>', function() {

  describe('viewModel', function() {
    let sortbar;

    beforeEach(function() {
      sortbar = new Sortbar();
    });

    it('defaults criteria to buildOrder/ascendent', function() {
      let criteria = sortbar.attr('criteria').attr();

      assert.deepEqual(criteria, {
        key: 'buildOrder',
        direction: 'asc'
      });
    });

    it('toggles a given sort direction', function() {
      assert.equal(sortbar.toggleDirection('asc'), 'desc');
      assert.equal(sortbar.toggleDirection('desc'), 'asc');
    });

    it('determines if a given key is the active criteria key', function() {
      assert.isTrue(sortbar.isSortedBy('buildOrder'), 'default criteria');
      assert.isFalse(sortbar.isSortedBy('title'), 'default is buildOrder');

      sortbar.attr('criteria.key', 'title');
      assert.isTrue(sortbar.isSortedBy('title'));
    });

    it('sets sort criteria properly', function() {
      sortbar.setSortCriteria('title');
      assert.deepEqual(sortbar.attr('criteria').attr(), {
        key: 'title',
        direction: 'asc' // default is asc
      });

      // setting an already key, causes the sort direction to be toggled.
      sortbar.setSortCriteria('title');
      assert.deepEqual(sortbar.attr('criteria').attr(), {
        key: 'title',
        direction: 'desc'
      });
    });
  });

});


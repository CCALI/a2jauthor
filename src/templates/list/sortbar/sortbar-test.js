import { assert } from 'chai'
import { Sortbar } from './sortbar'

import 'steal-mocha'

describe('<templates-sortbar>', function () {
  describe('viewModel', function () {
    let sortbar

    beforeEach(function () {
      sortbar = new Sortbar()
    })

    it('toggles a given sort direction', function () {
      assert.equal(sortbar.toggleDirection('asc'), 'desc')
      assert.equal(sortbar.toggleDirection('desc'), 'asc')
    })

    it('determines if a given key is the active criteria key', function () {
      sortbar.attr('criteria.key', 'buildOrder')

      assert.isTrue(sortbar.isSortedBy('buildOrder'))
      assert.isFalse(sortbar.isSortedBy('title'))

      sortbar.attr('criteria.key', 'title')
      assert.isTrue(sortbar.isSortedBy('title'))
    })

    it('sets sort criteria properly', function () {
      sortbar.setSortCriteria('title')
      assert.deepEqual(sortbar.attr('criteria').attr(), {
        key: 'title',
        direction: 'asc' // default is asc
      })

      // setting an already key, causes the sort direction to be toggled.
      sortbar.setSortCriteria('title')
      assert.deepEqual(sortbar.attr('criteria').attr(), {
        key: 'title',
        direction: 'desc'
      })
    })
  })
})

import { assert } from 'chai'
import { MapperListVM } from './mapper-list'

import 'steal-mocha'

describe('<mapper-list>', () => {
  describe('ViewModel', () => {
    let vm
    beforeEach(() => {
      vm = new MapperListVM()
    })

    it('pagesByStep', () => {
      const sortedPages = [
        { name: 'page1', 'step': '0' },
        { name: 'page2', 'step': '1' },
        { name: 'page3', 'step': '1' }
      ]
      vm.guide = { sortedPages }
      const pagesByStep = vm.pagesByStep
      assert.equal(pagesByStep[0].length, 1, 'step 0 should have 1 page')
      assert.equal(pagesByStep[1].length, 2, 'step 1 should have 2 pages')
    })
  })
})

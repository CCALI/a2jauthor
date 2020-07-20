import { assert } from 'chai'
import { MapperListVM } from './mapper-list'
import stache from 'can-stache'
import canViewModel from 'can-view-model'

import 'steal-mocha'

describe('<mapper-list>', () => {
  describe('ViewModel', () => {
    let vm
    let oldSteps

    beforeEach(() => {
      // backup global
      oldSteps = window.collapsedSteps
      vm = new MapperListVM()
    })

    afterEach(function () {
      // restore global
      window.collapsedSteps = oldSteps
    })

    it('collapsedSteps', () => {
      window.collapsedSteps = [true, false]
      assert.deepEqual(vm.collapsedSteps, [true, false], 'it should reference the global collapsedSteps')
    })

    it('isExpanded', () => {
      window.collapsedSteps = [true, false, true]
      const expectedResults = []
      vm.collapsedSteps.forEach((step, index) => {
        // isExpanded is the opposite of collapsed boolean
        expectedResults.push(!vm.isExpanded(index))
      })

      assert.deepEqual(vm.collapsedSteps, expectedResults, 'the expanded results should be the opposite of the collapsedSteps booleans')
    })
  })

  describe('Component', () => {
    const render = (data) => {
      const tpl = stache('<mapper-list pagesAndPopups:from="pagesAndPopups" />')
      document.querySelector('#test-area').appendChild(tpl(data))
      return canViewModel('mapper-list')
    }

    let oldSteps

    beforeEach(() => {
      // backup global
      oldSteps = window.collapsedSteps
    })

    it('collapses page lists based on window.collapsedSteps', (done) => {
      window.collapsedSteps = [true, false, true]
      // references stepNumber to get 'checked' state
      const pagesAndPopups = {
        0: { stepNumber: 0 },
        1: { stepNumber: 1 },
        2: { stepNumber: 2 }
      }

      const vm = render({ pagesAndPopups })
      setTimeout(() => {
        const expectedResults = []
        document.querySelectorAll('.toggle').forEach((input) => {
          // checked is opposite of collapsedSteps
          expectedResults.push(!input.checked)
        })

        assert.deepEqual(vm.collapsedSteps, expectedResults, 'should apply checked attribute to non collapsed steps')
        done()
      })
    })

    afterEach(function () {
      // restore global
      window.collapsedSteps = oldSteps
      document.querySelector('#test-area').innerHTML = ''
    })
  })
})

import { assert } from 'chai'
import { MapperListVM } from './mapper-list'
import stache from 'can-stache'
import canViewModel from 'can-view-model'

import 'steal-mocha'

describe('<mapper-list>', () => {
  describe('ViewModel', () => {
    let vm
    beforeEach(() => {
      vm = new MapperListVM()
    })

    it('collapsedSteps', () => {
      const oldSteps = window.collapsedSteps
      window.collapsedSteps = [true, false]
      assert.deepEqual(vm.collapsedSteps, [true, false], 'it should reference the global collapsedSteps')
      window.collapsedSteps = oldSteps
    })
  })

  describe('Component', () => {
    afterEach(function () {
      document.querySelector('#test-area').innerHTML = ''
    })

    function render (data) {
      const tpl = stache('<mapper-list pagesAndPopups:from="pagesAndPopups" />')
      document.querySelector('#test-area').appendChild(tpl(data))
      return canViewModel('mapper-list')
    }

    it('restoreCollapsedSteps', (done) => {
      const oldGlobalCollapsedSteps = window.collapsedSteps
      window.collapsedSteps = [ true, false, false ]

      // labelBackground: `lbl-background${step.number}`,
      const pagesAndPopups = {
        0: { displayName: 'STEP 0', toggleTriggerId: 'foo', labelBackground: 'foo-lbl', pages: [] },
        1: { displayName: 'STEP 1', toggleTriggerId: 'bar', labelBackground: 'bar-lbl', pages: [] },
        2: { displayName: 'STEP 2', toggleTriggerId: 'baz', labelBackground: 'baz-lbl', pages: [] }
      }
      const vm = render({
        pagesAndPopups
      })

      setTimeout(() => {
        const expectedResults = []
        for (const [ stepNumber, stepInfo ] of vm.pagesAndPopups) {
          const targetInput = document.getElementById(stepInfo.toggleTriggerId)
          const isCollapsed = !targetInput.checked
          expectedResults[stepNumber] = isCollapsed
        }

        assert.deepEqual(vm.collapsedSteps, expectedResults, 'should set checked attribute based on global collapsedState')

        // restore global
        window.collapsedSteps = oldGlobalCollapsedSteps
        done()
      })
    })
  })
})

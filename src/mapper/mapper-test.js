import { assert } from 'chai'
import { MapperVM } from './mapper'
import CanMap from 'can-map'

import 'steal-mocha'

describe('<mapper-page>', () => {
  describe('ViewModel', () => {
    let vm
    beforeEach(() => {
      vm = new MapperVM({
        guide: new CanMap({
          sortedPages: [
            { name: 'intro', type: 'a2j', buttons: [], step: 0, mapx: 0, mapy: 0 },
            { name: 'address', type: 'a2j', buttons: [], step: 1, mapx: 1, mapy: 1 },
            { name: 'salary', type: 'a2j', buttons: [], step: 1, mapx: 2, mapy: 2 },
            { name: 'somePop', type: 'Popup', buttons: [], step: 0, mapx: 3, mapy: 3 }
          ],
          steps: [{ number: '0', text: 'info' }, { number: '1', text: 'qualify' }, { number: '2', text: 'document' }]
        })
      })
    })

    it('onSelectPageName', () => {
      vm.onSelectPageName('foo')
      assert.equal(vm.selectedPageName, 'foo', 'onSelectPageName handler function sets onSelectPageName')
    })

    it('pagesAndPopups', () => {
      const pagesAndPopups = vm.pagesAndPopups
      const step0 = pagesAndPopups['0']
      const step1 = pagesAndPopups['1']
      assert.equal(step0.pages.length, 1, 'sorts step0 pages correctly')
      assert.equal(step0.displayName, 'STEP 0', 'should set displayName')

      assert.equal(step1.pages.length, 2, 'sorts step1 pages correctly')
      assert.equal(step1.displayName, 'STEP 1', 'should set displayName')
    })

    it('pagesAndPopup when Author changes step.number', () => {
      // change step number prop
      vm.guide.steps[0].number = '1'
      vm.guide.steps[1].number = '2'
      vm.guide.steps[2].number = '3'

      const pagesAndPopups = vm.pagesAndPopups

      const step0 = pagesAndPopups['0']
      const step1 = pagesAndPopups['1']
      const step2 = pagesAndPopups['2']

      assert.equal(step0, undefined, 'step0 should be undefined in this case')

      assert.equal(step1.pages.length, 1, 'sorts step0 pages correctly')
      assert.equal(step1.displayName, 'STEP 1', 'should set displayName')

      assert.equal(step2.pages.length, 2, 'sorts step1 pages correctly')
      assert.equal(step2.displayName, 'STEP 2', 'should set displayName')
    })

    it('lastCoordinatesByStep', () => {
      const lastCoordinatesByStep = vm.lastCoordinatesByStep
      // popups are always step 0
      assert.deepEqual(lastCoordinatesByStep['0'], { mapx: 0, mapy: 0 }, 'should store greatest x and y values for step0')
      assert.deepEqual(lastCoordinatesByStep['1'], { mapx: 2, mapy: 2 }, 'should store greatest x and y values for step1')
    })
  })
})

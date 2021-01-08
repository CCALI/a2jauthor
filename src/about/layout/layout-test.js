import { AboutLayoutVm } from './layout'
import { assert } from 'chai'
import DefineMap from 'can-define/map/map'

import 'steal-mocha'

describe('<about-layout>', () => {
  describe('viewModel', () => {
    let vm = new AboutLayoutVm()
    vm.guide = new DefineMap({ logoImage: '' })

    it('setGuideProp', () => {
      vm.setGuideProp('logoImage', 'foo')
      assert.equal(vm.guide.logoImage, 'foo', 'should set the guide property')
    })
  })
})

import { AboutLayoutVm } from './layout'
import { assert } from 'chai'
import CanMap from 'can-map'

import 'steal-mocha'

describe('<about-layout>', () => {
  describe('viewModel', () => {
    let vm = new AboutLayoutVm()
    vm.guide = new CanMap({ logoImage: '' })

    it('setGuideProp', () => {
      vm.setGuideProp('logoImage', 'foo')
      assert.equal(vm.guide.logoImage, 'foo', 'should set the guide property')
    })
  })
})

import { AboutVM } from './about'
import { assert } from 'chai'
import CanMap from 'can-map'

import 'steal-mocha'

describe('<about-tab>', () => {
  describe('viewModel', () => {
    let vm = new AboutVM()
    vm.guide = new CanMap({ description: '' })

    it('connectedCallback', (done) => {
      vm.connectedCallback()
      const oldGlobalGuide = window.gGuide

      window.gGuide = { description: '' }
      vm.guide.description = 'foo'

      setTimeout(() => {
        assert.equal(window.gGuide.description, 'foo', 'changes to CanJS `guide` should proxy to the global gGuide')
        window.gGuide = oldGlobalGuide
        done()
      })
    })
  })
})

import { AboutVM } from './about'
import { assert } from 'chai'
import DefineMap from 'can-define/map/map'

import 'steal-mocha'

describe('<about-tab>', () => {
  describe('viewModel', () => {
    let vm = new AboutVM()
    vm.guide = new DefineMap({ description: '' })

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

    it('cleanupRevisionNotes', () => {
      vm.guide.notes = '<p>This paragraph > yours,<b>this</b> sure is!</p><legend></span>'
      vm.connectedCallback()
      assert.equal(vm.guide.notes, 'This paragraph > yours,this sure is!', 'should remove any stray html tags only')
    })
  })
})

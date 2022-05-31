import { AboutVM } from './about'
import { assert } from 'chai'
import DefineMap from 'can-define/map/map'

import 'steal-mocha'

describe('<about-tab>', () => {
  describe('viewModel', () => {
    const vm = new AboutVM()
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
      vm.guide.notes = '<p>9/19/2018 <strong>interview</strong> created.</p>\n\n<p>new line <em>double</em> space<br />\nnewline 2 single <u>space</u></p>\n'
      const expectedResult = '9/19/2018 interview created.\n\nnew line double space\nnewline 2 single space\n'
      vm.connectedCallback()
      assert.equal(vm.guide.notes, expectedResult, 'should remove any stray html tags only, preserving new lines')
    })
  })
})

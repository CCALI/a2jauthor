import { assert } from 'chai'
import CanMap from 'can-map'
import stache from 'can-stache'
import canViewModel from 'can-view-model'

import 'steal-mocha'

describe('<about-revision>', () => {
  describe('Component', () => {
    it('connectedCallback', (done) => {
      // no op for domMutate
      window.can = {
        domMutate: {
          onNodeRemoval: () => { return false }
        }
      }

      const render = (data) => {
        const tpl = stache('<about-revision guide:from="guide" />')
        document.querySelector('#test-area').appendChild(tpl(data))
        return canViewModel('about-revision')
      }

      const guide = new CanMap({ notes: 'start', sendrevision: false, emailContact: '', version: '' })
      const vm = render({ guide })

      setTimeout(() => {
        const ckeDiv = document.querySelector('.htmledit')
        const divNotes = ckeDiv.textContent

        assert.equal(divNotes, vm.guide.notes, 'should restore current notes from guide')
        done()
      })
    })
  })
})

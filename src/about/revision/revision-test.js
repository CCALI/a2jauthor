import { assert } from 'chai'
import CanMap from 'can-map'
import stache from 'can-stache'
import canViewModel from 'can-view-model'
import './revision'

import 'steal-mocha'

describe('<about-revision>', () => {
  describe('Component', () => {
    afterEach(() => {
      document.getElementById('test-area').innerHTML = ''
    })

    // very light component, but do basic test
    it('basic notes/version test', () => {
      const render = (data) => {
        const tpl = stache('<about-revision guide:from="guide" />')
        document.querySelector('#test-area').appendChild(tpl(data))
        return canViewModel('about-revision')
      }

      const guide = new CanMap({ notes: 'some notes', sendrevision: false, emailContact: '', version: '12.20' })
      const vm = render({ guide })

      const inputs = document.querySelectorAll('input')
      const versionInput = inputs[0]
      const notesInput = inputs[1]

      assert.equal(versionInput.value, vm.guide.version, 'should match incoming version value')
      assert.equal(notesInput.value, vm.guide.notes, 'should match incoming notes value')
    })
  })
})

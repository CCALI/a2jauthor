import { assert } from 'chai'
import stache from 'can-stache'
import canViewModel from 'can-view-model'
import './variable-usage'

import 'steal-mocha'

describe('<variable-usage>', () => {
  describe('Component', () => {
    afterEach(() => {
      document.getElementById('test-area').innerHTML = ''
    })

    // very light component, but do basic test
    it('basic notes/version test', () => {
      const render = (data) => {
        const tpl = stache('<variable-usage initialVarName:from="initialVarName" />')
        document.querySelector('#test-area').appendChild(tpl(data))
        return canViewModel('variable-usage')
      }

      const vm = render({ initialVarName: 'Foo' })

      const versionInput = document.querySelector('input')
      const notesTextarea = document.querySelector('textarea')

      assert.equal(versionInput.value, vm.guide.version, 'should match incoming version value')
      assert.equal(notesTextarea.value, vm.guide.notes, 'should match incoming notes value')
    })
  })
})

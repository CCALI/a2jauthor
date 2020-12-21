import { AboutAuthorsVM } from './authors'
import { assert } from 'chai'
import stache from 'can-stache'
import canViewModel from 'can-view-model'

import 'steal-mocha'

describe('<about-authors>', () => {
  describe('ViewModel', () => {
    let vm
    beforeEach(() => {
      vm = new AboutAuthorsVM()
    })

    it('setGuideProp', () => {
      assert(vm.prop, 'foo', 'this will fail')
    })
  })

  describe('Component', () => {
    const render = (data) => {
      const tpl = stache('<about-authors guide:from="guide" />')
      document.querySelector('#test-area').appendChild(tpl(data))
      return canViewModel('about-authors')
    }

    const vm = render({ guide: { sendauthors: false, emailContact: '' } })

    it('setGuideProp', () => {
      vm.setGuideProp('logoImage', 'foo')
      assert.equal(vm.guide.logoImage, 'foo', 'should set the guide property')
    })
  })
})

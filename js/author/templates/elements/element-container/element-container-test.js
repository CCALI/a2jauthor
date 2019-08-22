import $ from 'jquery'
import { assert } from 'chai'
import stache from 'can-stache'
import domEvents from 'can-dom-events'

import 'steal-mocha'
import './element-container'

describe('<element-container>', function () {
  describe('Component', function () {
    beforeEach(function () {
      const toggleEditActiveNode = () => { console.log('toggle') }
      let frag = stache(
        `<element-container toggleEditActiveNode:from="toggleEditActiveNode">
          <h2>SectionTitle</h2>
        </element-container>`
      )

      $('#test-area').html(frag({ toggleEditActiveNode }))
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('sets "selected" to "true" on dblclick', function () {
      const container = $('element-container')[0]
      const vm = container.viewModel
      const wrapper = $(container).find('.wrapper')[0]
      assert.isFalse(vm.attr('selected'), 'should default to false')

      domEvents.dispatch(wrapper, 'dblclick')

      assert.isTrue(vm.attr('selected'))
    })

    it('hides element-toolbar if not selected', function () {
      let vm = $('element-container')[0].viewModel

      assert.isFalse(vm.attr('selected'), 'should default to false')
      assert(!$('element-toolbar').length, 'element-toolbar should not be rendered')
    })

    it('shows element-toolbar if selected', function () {
      let vm = $('element-container')[0].viewModel

      vm.attr('selected', true)
      assert($('element-toolbar').length, 'should be visible')
    })
  })
})

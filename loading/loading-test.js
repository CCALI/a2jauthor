import { assert } from 'chai'
import stache from 'can-stache'
import $ from 'jquery'
import 'steal-mocha'
import { LoadingVM } from './loading'

describe('<app-loading>', function () {
  describe('viewModel', function () {
    let vm
    beforeEach(() => {
      vm = new LoadingVM()
    })

    it('has a default loading loadingMessage', () => {
      assert.equal(vm.loadingMessage, 'Loading ...', 'should display default loading message if none passed')
    })

    it('should take a custom loadingMessage', () => {
      vm.loadingMessage = 'Building Report ...'
      assert.equal(vm.loadingMessage, 'Building Report ...', 'should match passed in custom loading message')
    })
  })

  describe('Component', function () {
    let vm
    beforeEach(function (done) {
      let frag = stache('<app-loading></app-loading>')
      $('#test-area').html(frag())
      vm = $('app-loading')[0].viewModel
      done()
    })

    it('should allow for an overlay style', () => {
      vm.hasOverlay = true
      const addedOverlayClass = $('.overlay-active')
      assert.equal(addedOverlayClass.length, 2, 'should add overlay-active class to .app-loading and p tag')
    })

    afterEach(function () {
      $('#test-area').empty()
    })
  })
})

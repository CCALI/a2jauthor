import $ from 'jquery'
import { assert } from 'chai'
import {Alert} from './alert'
import stache from 'can-stache'

import 'steal-mocha'

describe('<app-alert>', function () {
  describe('viewModel', function () {
    let vm

    beforeEach(function () {
      vm = new Alert()
    })

    it('is closed by default', function () {
      assert.isFalse(vm.attr('open'))
    })

    it('defaults autoClose to false', function () {
      assert.isFalse(vm.attr('autoClose'))
    })

    it('is not dismissible by default', function () {
      assert.isFalse(vm.attr('dismissible'))
    })

    it('defaults autoCloseTime to 5000ms', function () {
      assert.equal(vm.attr('autoCloseTime'), 5000)
    })

    it('sets "open" back to "false" if "autoClose" is true', function (done) {
      let delay = 0

      vm.attr('autoClose', true)
      vm.attr('autoCloseTime', delay)
      vm.attr('open', true)

      assert.isTrue(vm.attr('open'), 'should be opened')
      assert(vm.attr('autoCloseTimeoutId'), 'a timeout should be set')

      setTimeout(function () {
        assert.isFalse(vm.attr('open'), 'should not be opened')
        done()
      }, delay)
    })
  })

  describe('Component', function () {
    beforeEach(function () {
      $.fx.off = true
      let frag = stache('<app-alert open="true"></app-alert>')
      $('#test-area').html(frag())
    })

    afterEach(function () {
      $.fx.off = false
      $('#test-area').empty()
    })

    it('is visible if "open" is "true"', function () {
      assert.isTrue($('app-alert').is(':visible'))
    })

    it('is hidden if "open" is "false"', function () {
      $('app-alert').viewModel().attr('open', false)
      assert.isFalse($('app-alert').is(':visible'))
    })

    it('triggers "closed" event', function (done) {
      let vm = $('app-alert').viewModel()

      vm.bind('closed', function () {
        done()
        vm.unbind('closed')
      })

      vm.closeAlert()
    })

    it('close button is not visible unless dismissible', function () {
      let vm = $('app-alert').viewModel()

      // dismissible false by default
      assert.isFalse($('.close').is(':visible'))
      assert.isFalse($('.alert').hasClass('alert-dismissible'))

      vm.attr('dismissible', true)
      assert.isTrue($('.close').is(':visible'))
      assert.isTrue($('.alert').hasClass('alert-dismissible'))
    })
  })
})

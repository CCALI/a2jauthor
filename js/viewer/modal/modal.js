import Map from 'can/map/'
import Component from 'can/component/'
import template from './modal.stache'
import {Analytics} from 'caja/viewer/util/analytics'

import 'can/map/define/'
import 'bootstrap/js/modal'
import 'lightbox2/dist/js/lightbox'
import 'lightbox2/dist/css/lightbox.css'

export let ModalVM = Map.extend({})

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-modal',
  viewModel: ModalVM,

  helpers: {
    isGif (url = '') {
      const ext = url.split('.').pop()
      return ext.toLowerCase() === 'gif'
    },

    eval (str) {
      str = typeof str === 'function' ? str() : str
      return this.attr('logic').eval(str)
    }
  },

  events: {
    'a click': function (el, ev) {
      // popup from within a popup
      if (el.attr('href').toLowerCase().indexOf('popup') === 0) {
        ev.preventDefault()
        const vm = this.viewModel
        const pages = vm.attr('interview.pages')

        if (pages) {
          const pageName = $(el.get(0)).attr('href').replace('popup://', '').replace('POPUP://', '').replace('/', '') // pathname is not supported in FF and IE.
          const page = pages.find(pageName)
          const sourcePageName = this.scope.attr('rState.lastVisitedPageName')

          // piwik tracking of popups
          if (window._paq) {
            Analytics.trackCustomEvent('Pop-Up', 'from: ' + sourcePageName, pageName)
          }

          // popup content is only title, text, and textAudio
          // but title is internal descriptor so set to empty string
          vm.attr('modalContent', {
            title: '',
            text: page.text,
            audioURL: page.textAudioURL
          })
        } else { // external link
          el.attr('target', '_blank')
        }
      }
    },

    '{viewModel} modalContent': function (vm, ev, newVal) {
      if (newVal) {
        this.element.find('#pageModal').modal()
      }
    },

    '#pageModal hidden.bs.modal': function () {
      // answer names are always lowercase versions in the answers map
      const answerName = this.scope.attr('modalContent.answerName') && this.scope.attr('modalContent.answerName').toLowerCase()
      if (answerName) {
        const interviewAnswers = this.scope.attr('interview.answers')
        const answerValues = interviewAnswers.attr(answerName + '.values')
        const textlongValue = this.scope.attr('modalContent.textlongValue')
        const answerIndex = this.scope.attr('modalContent.answerIndex')

        answerValues.attr(answerIndex, textlongValue)
      }

      this.viewModel.attr('modalContent', null)
    }
  }
})

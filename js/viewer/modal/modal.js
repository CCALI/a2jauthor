import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './modal.stache'
import { Analytics } from 'caja/viewer/util/analytics'

import 'bootstrap/js/modal'
import 'can-map-define'
import 'lightbox2/dist/js/lightbox'
import 'lightbox2/dist/css/lightbox.css'

export let ModalVM = DefineMap.extend('ViewerModalVM', {
  // passed in
  modalContent: {},
  repeatVarValue: {},
  lastVisitedPageName: {},
  logic: {},
  interview: {},

  fireCancel () {
    $('body').removeClass('bootstrap-styles')
  },

  connectedCallback (el) {
    const showModalHandler = () => {
      $('body').addClass('bootstrap-styles')
    }
    const closeModalHandler = () => {
      // answer names are always lowercase versions in the answers map
      const answerName = this.modalContent.answerName && this.modalContent.answerName.toLowerCase()
      if (answerName) {
        const interviewAnswers = this.interview.answers
        const answerValues = interviewAnswers.attr(answerName + '.values')
        const textlongValue = this.scope.attr('modalContent.textlongValue')
        const answerIndex = this.scope.attr('modalContent.answerIndex')

        answerValues.attr(answerIndex, textlongValue)
      }

      this.fireCancel()
      this.modalContent = null
    }

    $('#pageModal').on('shown.bs.modal', showModalHandler)
    $('#pageModal').on('hidden.bs.modal', closeModalHandler)

    return () => {
      $('#pageModal').off('shown.bs.modal', showModalHandler)
      $('#pageModal').off('hidden.bs.modal', closeModalHandler)
    }
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'a2j-modal',
  ViewModel: ModalVM,

  helpers: {
    isGif (url = '') {
      const ext = url.split('.').pop()
      return ext.toLowerCase() === 'gif'
    },

    eval (str) {
      str = typeof str === 'function' ? str() : str
      return this.logic.eval(str)
    }
  },

  events: {
    'a click': function (el, ev) {
      // popup from within a popup
      if (el.href && el.href.toLowerCase().indexOf('popup') === 0) {
        ev.preventDefault()
        const vm = this.viewModel
        const pages = vm.interview.pages

        if (pages) {
          const pageName = el.href.replace('popup://', '').replace('POPUP://', '').replace('/', '') // pathname is not supported in FF and IE.
          const page = pages.find(pageName)
          const sourcePageName = this.scope.rState.lastVisitedPageName

          // piwik tracking of popups
          if (window._paq) {
            Analytics.trackCustomEvent('Pop-Up', 'from: ' + sourcePageName, pageName)
          }

          // popup content is only title, text, and textAudio
          // but title is internal descriptor so set to empty string
          vm.modalContent = {
            // undefined values prevent stache warnings
            answerName: undefined,
            title: '',
            text: page.text,
            imageURL: undefined,
            audioURL: page.textAudioURL,
            videoURL: undefined
          }
        } else { // external link
          const $el = $(el)
          $el.attr('target', '_blank')
        }
      }
    },

    '{viewModel} modalContent': function (vm, ev, newVal) {
      if (newVal) {
        $(this.element).find('#pageModal').modal()
      }
    },

    '#pageModal click' (target, event) {
      const isBackgroundClick = $(event.target).is('.author-modal')
      if (isBackgroundClick) {
        this.viewModel.fireCancel()
      }
    }
  }
})

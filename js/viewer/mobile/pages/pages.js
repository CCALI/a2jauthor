import $ from 'jquery'
import PagesVM from './pages-vm'
import Component from 'can-component'
import template from './pages.stache'
import assembleFormTpl from './assemble-form.stache'
import saveAnswersFormTpl from './save-answers-form.stache'
import { Analytics } from 'caja/viewer/util/analytics'
import stache from 'can-stache'
import 'caja/viewer/mobile/util/helpers'

stache.registerPartial('assemble-form', assembleFormTpl)
stache.registerPartial('save-answers-form', saveAnswersFormTpl)

/**
 * @module {Module} viewer/mobile/pages/ <a2j-pages>
 * @parent api-components
 *
 * This component renders each of the interview pages and handle the
 * navigation between those pages.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-pages
 *     {lang}="lang"
 *     {(logic)}="logic"
 *     {(r-state)}="routeState"
 *     {(m-state)}="memoryState"
 *     {(interview)}="interview"
 *     {(p-state)}="persistedState" />
 * @codeend
 */

export default Component.extend({
  view: template,
  tag: 'a2j-pages',
  leakScope: true,
  ViewModel: PagesVM,

  helpers: {
    getButtonLabel (label) {
      return label || this.attr('lang')['Continue']
    },

    eval (str) {
      str = typeof str === 'function' ? str() : str
      return this.attr('logic').eval(str)
    }
  },

  events: {
    'a.learn-more click': function (el, ev) {
      ev.preventDefault()

      const vm = this.viewModel
      const pages = vm.attr('interview.pages')
      const pageName = vm.attr('rState.page')

      if (pages && pageName) {
        const page = pages.find(pageName)
        // piwik tracking of learn-more clicks
        if (window._paq) {
          Analytics.trackCustomEvent('Learn-More', 'from: ' + pageName, page.learn)
        }

        vm.attr('modalContent', {
          // name undefined prevents stache warnings
          answerName: undefined,
          title: page.learn,
          text: page.help,
          imageURL: page.helpImageURL,
          audioURL: page.helpAudioURL,
          videoURL: page.helpVideoURL
        })
      }
    },

    'a click': function (el, ev) {
      if (el.href && el.href.toLowerCase().indexOf('popup') === 0) {
        ev.preventDefault()
        const vm = this.viewModel
        const pages = vm.attr('interview.pages')

        if (pages) {
          const pageName = el.href.replace('popup://', '').replace('POPUP://', '').replace('/', '') // pathname is not supported in FF and IE.
          const page = pages.find(pageName)
          const sourcePageName = vm.attr('currentPage.name')

          // piwik tracking of popups
          if (window._paq) {
            Analytics.trackCustomEvent('Pop-Up', 'from: ' + sourcePageName, pageName)
          }

          // popups only have text, textAudioURL possible values
          // title (page.name) is more of internal descriptor for popups
          vm.attr('modalContent', {
            // undefined values prevent stache warnings
            answerName: undefined,
            title: '',
            text: page.text,
            imageURL: undefined,
            audioURL: page.textAudioURL,
            videoURL: undefined
          })
        }
      } else { // external link
        const $el = $(el)
        $el.attr('target', '_blank')
      }
    },

    // This event is fired when the Exit, Success, or AssembleSuccess button is clicked,
    // it waits to asynchronously submit the form that posts the XML answers
    // to the `setDataURL` endpoint.
    '{viewModel} post-answers-to-server': function () {
      // multiple answer forms can be on the page at once, only submit the first
      // as the answers to post in each instance of the form are the same
      const $form = this.element.find('.post-answers-form')[0]
      // prevent double clicks on submit
      if (this._isSubmitting) {
        return
      }

      this._isSubmitting = true
      // this timeout allows final page answers to be saved before posting
      setTimeout(function () {
        $form.submit()
      })
    },

    // when value of repeatVar changes, re-render page fields
    '{rState} repeatVarValue': function () {
      const vm = this.viewModel
      const fields = vm.attr('currentPage.fields')
      const rState = vm.attr('rState')
      // keep answer index in sync with repeatVarValue
      // when a user is navigating via the nav bar
      if (rState && rState.repeatVarValue) {
        rState.answerIndex = rState.repeatVarValue
      }

      vm.setFieldAnswers(fields)
    },

    '{rState} page': function (rState, ev, newPageName) {
      this.viewModel.changePage(rState, newPageName)
    }

  }
})

import $ from 'jquery'
import CanMap from 'can-map'
import compute from 'can-compute'
import _assign from 'lodash/assign'
import Component from 'can-component'
import isMobile from 'caja/viewer/is-mobile'
import template from 'caja/viewer/app.stache'
import Lang from 'caja/viewer/mobile/util/lang'
import Logic from 'caja/viewer/mobile/util/logic'
import AppState from 'caja/viewer/models/app-state'
import Interview from 'caja/viewer/models/interview'
import MemoryState from 'caja/viewer/models/memory-state'
import PersistedState from 'caja/viewer/models/persisted-state'
import parseGuideToMobile from 'caja/viewer/mobile/util/guide-to-mobile'

const ViewerPreviewVM = CanMap.extend('ViewerPreviewVM', {
  define: {
    // passed in via viewer-preview-layout.stache bindings
    remainingSteps: {},
    maxDisplayedSteps: {},
    traceMessage: {},

    interviewPageName: {
      get: function () {
        return this.attr('rState.page')
      }
    }
  },

  connectedCallback (el) {
    const vm = this
    const rState = new AppState()
    const tearDownAppState = rState.connectedCallback(el)
    const mState = new MemoryState()
    const pState = new PersistedState()

    const previewAnswers = vm.attr('interview.answers') ? vm.attr('interview.answers') : null

    // Set fileDataURL to window.gGuidePath, so the viewer can locate the
    // interview assets (images, sounds, etc).
    mState.attr('fileDataURL', vm.attr('guidePath'))

    const mobileData = parseGuideToMobile(_assign({}, window.gGuide))
    const parsedData = Interview.parseModel(mobileData)
    const interview = new Interview(parsedData)
    const lang = new Lang(interview.attr('language'))

    const answers = pState.attr('answers')
    answers.attr('lang', lang)
    answers.attr(_assign({}, interview.serialize().vars))

    interview.attr('answers', answers)
    rState.interview = interview

    // needs to be created after answers are set
    const logic = new Logic({ interview })
    rState.logic = logic
    rState.traceMessage = this.traceMessage

    // listen for _tLogic trace message events
    const tLogic = rState.logic._tLogic
    tLogic.listenTo('traceMessage', (ev) => {
      rState.traceMessage.addMessage(ev.message)
    })

    // if previewPageName is set, we need to make sure the viewer
    // loads that specific page (covers the case when user clicks
    // `preview` from the edit page popup).
    if (vm.attr('previewPageName')) {
      rState.view = 'pages'
      rState.page = vm.attr('previewPageName')
    } else {
      rState.view = 'intro'
    }

    const modalContent = compute()

    if (previewAnswers) {
      previewAnswers.forEach(function (answer) {
        let name = answer.name ? answer.name.toLowerCase() : ''
        if (interview.attr('answers.' + name)) {
          interview.attr('answers.' + name + '.values', answer.attr('values'))
        }
      })
    }

    vm.attr({
      rState,
      pState,
      mState,
      interview,
      logic,
      lang,
      isMobile,
      modalContent
    })

    $(el).html(template(vm))

    return () => {
      this.stopListening()
      tearDownAppState()
    }
  }
})

export default Component.extend({
  tag: 'a2j-viewer-preview',
  ViewModel: ViewerPreviewVM,
  leakScope: true
})

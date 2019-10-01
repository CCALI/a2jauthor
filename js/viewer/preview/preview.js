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

import 'can-map-define'

const ViewerPreviewVM = CanMap.extend('ViewerPreviewVM', {
  define: {
    // passed in via viewer-preview-layout.stache bindings
    guidePath: {},
    showDebugPanel: {},
    previewPageName: {},
    traceMessage: {},
    // passed up to Author app-state via viewer-preview-layout.stache bindings
    previewInterview: {},
    interviewPageName: {
      get: function () {
        return this.attr('rState.page')
      }
    },
    // set by attr call in connectedCallback
    rState: {},
    pState: {},
    mState: {},
    interview: {},
    logic: {},
    lang: {},
    isMobile: {},
    modalContent: {}
  },

  connectedCallback (el) {
    const vm = this
    const rState = new AppState()
    const tearDownAppState = rState.connectedCallback(el)
    const mState = new MemoryState()
    const pState = new PersistedState()

    // Set fileDataURL to window.gGuidePath, so the viewer can locate the
    // interview assets (images, sounds, etc).
    mState.attr('fileDataURL', vm.attr('guidePath'))

    const mobileData = parseGuideToMobile(_assign({}, window.gGuide))
    const parsedData = Interview.parseModel(mobileData)
    const interview = new Interview(parsedData)
    const lang = new Lang(interview.attr('language'))

    // if interview.answers exist here, they are restored from Author app-state binding
    const previewAnswers = vm.attr('interview.answers') ? vm.attr('interview.answers') : null

    const answers = pState.attr('answers')
    let serializedVars = interview.serialize().vars

    if (previewAnswers) { // restore previous answers with any new vars
      const serializedpreviewAnswers = previewAnswers.serialize()
      const restoredAnswers = _assign(serializedVars, serializedpreviewAnswers)
      answers.attr(_assign({}, restoredAnswers))
    } else { // just set the interview vars
      answers.attr(_assign({}, serializedVars))
    }

    answers.attr('lang', lang)
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
    rState.view = 'pages'
    if (vm.attr('previewPageName')) {
      rState.set('page', vm.attr('previewPageName'))
    } else {
      rState.set('page', interview.attr('firstPage'))
    }

    const modalContent = compute()

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

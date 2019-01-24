import $ from 'jquery'
import CanMap from 'can-map'
import CanList from 'can-list'
import A2JVariable from './a2j-variable'
import _isEmpty from 'lodash/isEmpty'
import { Gender, Hair, Skin } from 'caja/viewer/desktop/avatar/colors'
import route from 'can-route'
import 'can-map-define'

// !steal-remove-start
import debug from 'can-debug'
debug()
// !steal-remove-end

// with the existing Guide model that works with a different data structure.
let Guide = CanMap.extend('AppStateGuide', {
  define: {
    variablesList: {
      get () {
        let vars = this.attr('vars')
        return A2JVariable.fromGuideVars(vars.attr())
      }
    },

    guideGender: {
      type: Gender,
      value: Gender.defaultValue
    },

    avatarSkinTone: {
      type: Skin,
      value: Skin.defaultValue
    },

    avatarHairColor: {
      type: Hair,
      value: Hair.defaultValue
    }
  }
})

/**
 * @module {function} AuthorAppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default CanMap.extend('AuthorAppState', {
  define: {
    /**
    * @property {String} selectedReport
    *
    * selected report type
    */
    selectedReport: {
      serialize: false
    },

    /**
    * @property {List} interviews
    *
    * list of interviews
    * used to pass between toolbar and interviews component
    */
    interviews: {
      serialize: false
    },

    /**
    * @property {List} traceLogic
    *
    * latest message to display in the trace panel
    */
    traceLogic: {
      serialize: false
    },

    /**
    * @property {List} traceLogicList
    *
    * active list of each pages traceLogic
    */
    traceLogicList: {
      serialize: false
    },

    /**
     * @property {String} page
     *
     * The name of the "tab" the author is seeing, it is bound to can.route.
     *
     */
    page: {
      value: ''
    },

    /**
     * @property {String} guideId
     *
     * The identifier to the guideId interview currently loaded.
     */
    guideId: {
      value () {
        return window.gGuideID || ''
      }
    },

    /**
     * @property {String} templateId
     *
     * The identifier to the templateId interview currently loaded.
     */
    templateId: {},

    /**
     * @property {String} guidePath
     *
     * The path to the folder where the Guide.xml file is located.
     */
    guidePath: {
      serialize: false,
      value () {
        return window.gGuidePath || ''
      }
    },

    /**
     * @property {can.Map} guide
     *
     * The current selected guided interview.
     */
    guide: {
      serialize: false,

      set (gGuide = {}) {
        return new Guide(gGuide)
      }
    },

    /**
     * @property {Boolean} showDebugPanel
     *
     * Whether to show the debug panel (variables and trace panels) when
     * the author is previewing the interview.
     */
    showDebugPanel: {
      value: false,
      serialize: false,
      get (val) {
        let page = this.attr('page')
        return (page === 'preview') ? val : false
      }
    },

    /**
     * @property {Boolean} previewMode
     *
     * Whether user has toggled the interview preview mode, the viewer
     * app will be rendered if `true`.
     */
    previewMode: {
      value: false,
      serialize: false,
      get (val) {
        let page = this.attr('page')
        return (page === 'preview') ? val : false
      }
    },

    /**
     * @property {Boolean} showDevPublishButtons
     *
     * Whether currently developing locally or on Staging server
     * used to show special DEV publish buttons for LHI and Marlabs
     */
    showDevPublishButtons: {
      value: false,
      serialize: false,
      get () {
        return window.location.hostname === 'localhost' || window.location.hostname === 'staging.a2jauthor.org'
      }
    },

    /**
     * @property {String} previewPageName
     *
     * The name of the page that will be loaded when user clicks the preview
     * button in the edit page popup, when empty the first page of the interview
     * will be loaded.
     */
    previewPageName: {
      value: '',
      serialize: false
    },

    /**
     * @property {String} interviewPageName
     *
     * The name of the page that is currently being previewed in the viewer
     * app, it is bound to viewer's route page property.
     */
    interviewPageName: {
      value: '',
      serialize: false
    },

    /**
     * @property {CanList} viewerAlertMessages
     *
     * List of error messages meant to be displayed to the user (author) in
     * preview mode.
     */
    viewerAlertMessages: {
      value () {
        return new CanList()
      },
      serialize: false
    },

    /**
     * @property {Boolean} hideAllGrades
     *
     * Used to pass state between reports tab and toolbar
     */
    hideAllGrades: {
      serialize: false
    },

    /**
     * @property {String} viewerInterview
     *
     * The Interview instance used by the viewer app in preview mode.
     * this is set by viewer-preview-layout.stache bindings
     */
    viewerInterview: {
      serialize: false
    },

    /**
     * @property {can.Map} globalAlertProps
     *
     * This map holds some properties use to control the behavior of the
     * `app-alert` used to notify errors and other messages globally across
     * the different tabs
     */
    globalAlertProps: {
      serialize: false,
      value () {
        return {
          open: false,
          message: '',
          alertType: 'danger'
        }
      }
    },

    /**
     * @property {can.List} legalNavStates
     *
     * The list of available states for within the legalNav guid
     * CKEditor widget
     */
    legalNavStates: {
      serialize: false,
      value () {
        return [['AK'], ['HI']]
      }
    }
  },

  init () {
    let appState = this

    // Add the legalNavStates to the window
    // So we can access this within the CKEditor widget
    window.legalNavStates = appState.attr('legalNavStates').serialize()

    $(document).ajaxError(function globalAjaxHandler (event, jqxhr) {
      let status = jqxhr.status
      let response = jqxhr.responseJSON || {}

      if (status >= 400 && !_isEmpty(response.error)) {
        appState.attr('globalAlertProps', {
          open: true,
          alertType: 'danger',
          message: response.error.message
        })
      }
    })

    // Check if we have a guide
    // if not navigate back to the interviews page
    // This is to fix issues with page reload not having the gGuide loaded
    setTimeout(() => {
      if (!appState.gGuide && typeof route.data.attr === 'function') {
        route.data.attr('page', 'interviews')
        if (route.data.attr('guideId')) {
          route.data.attr('guideId', '')
        }
        if (route.data.attr('templateId')) {
          route.data.attr('templateId', '')
        }
      }
    }, 0)
  },

  toggleDebugPanel () {
    let val = this.attr('showDebugPanel')
    this.attr('showDebugPanel', !val)
  }
})

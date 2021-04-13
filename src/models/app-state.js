import $ from 'jquery'
import CanList from 'can-list'
import DefineMap from 'can-define/map/map'
import TraceMessage from 'a2jauthor/src/models/trace-message'
import GlobalPrefs from 'a2jauthor/src/models/global-preferences'
import A2JVariable from '@caliorg/a2jdeps/models/a2j-variable'
import constants from 'a2jauthor/src/models/constants'
import _isEmpty from 'lodash/isEmpty'
import { Gender, Hair, Skin } from '@caliorg/a2jdeps/avatar/colors'
import ckeArea from '~/src/utils/ckeditor-area'
import route from 'can-route'
import 'can-map-define'

// !steal-remove-start
import debug from 'can-debug'
debug()
// !steal-remove-end

// with the existing Guide model that works with a different data structure.
const Guide = DefineMap.extend('AppStateGuide', {
  variablesList: {
    get () {
      const vars = this.vars
      return A2JVariable.fromGuideVars(vars.serialize())
    }
  },

  guideGender: {
    type: Gender,
    default: Gender.defaultValue
  },

  avatarSkinTone: {
    type: Skin,
    default: Skin.defaultValue
  },

  avatarHairColor: {
    type: Hair,
    default: Hair.defaultValue
  }
})

/**
 * @module {function} AuthorAppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default DefineMap.extend('AuthorAppState', {
  /**
  * @property {String} authorVersion
  *
  * displayed in vertical-navbar and author-footer
  */
  authorVersion: {
    serialize: false,
    get () {
      return 'A2J ' + constants.A2JVersionNum + '-' + constants.A2JVersionDate
    }
  },
  /**
  * @property {String} selectedReport
  *
  * selected report type
  */
  selectedReport: {
    serialize: false
  },

  /**
  * @property {CanList} interviews
  *
  * list of interviews
  * used to pass between toolbar uploader and interviews component
  */
  interviews: {
    serialize: false
  },

  /**
  * @property {DefineMap} traceMessage
  *
  * trace-message model to manage messages for the debug-panel
  */
  traceMessage: {
    serialize: false,
    default: () => { return new TraceMessage() }
  },

  /**
   * @property {String} page
   *
   * The name of the "tab" the author is seeing, it is bound to can.route.
   *
   */
  page: {
    default: ''
  },

  /**
   * @property {String} guideId
   *
   * The identifier to the guideId interview currently loaded.
   */
  guideId: {
    default () {
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
   * @property {String} action
   *
   * Used for routing
   */
  action: {},

  /**
   * @property {String} guidePath
   *
   * The path to the folder where the Guide.xml file is located.
   */
  guidePath: {
    serialize: false,
    default () {
      return window.gGuidePath || ''
    }
  },

  /**
   * @property {DefineMap} guide
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
 * @module {function} GlobalPreferences
 * @parent api-models
 *
 * this is used to read,write and track localStorage preferences for the user
 * named gPrefs until Legacy code is refactored out completely
 */
  gPrefs: {
    serialize: false,
    default: () => {
      return new GlobalPrefs()
    }
  },

  /**
   * @property {Boolean} showDebugPanel
   *
   * Whether to show the debug panel (variables and trace panels) when
   * the author is previewing the interview.
   */
  showDebugPanel: {
    default: false,
    serialize: false,
    get (val) {
      return (this.page === 'preview') ? val : false
    }
  },

  /**
   * @property {Boolean} previewMode
   *
   * Whether user has toggled the interview preview mode, the viewer
   * app will be rendered if `true`.
   */
  previewMode: {
    default: false,
    serialize: false,
    get (val) {
      return (this.page === 'preview') ? val : false
    }
  },

  /**
   * @property {Boolean} showTesting
   *
   * used to hide testing interfaces (aka a2jorg publish buttons) on production
   */
  showTesting: {
    serialize: false,
    get () {
      return window.location.hostname !== 'www.a2jauthor.org'
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
    default: '',
    serialize: false
  },

  /**
   * @property {String} interviewPageName
   *
   * The name of the page that is currently being previewed in the viewer
   * app, it is bound to viewer's route page property.
   */
  interviewPageName: {
    default: '',
    serialize: false
  },

  /**
   * @property {CanList} viewerAlertMessages
   *
   * List of error messages meant to be displayed to the user (author) in
   * preview mode.
   */
  viewerAlertMessages: {
    default () {
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
   * @property {String} previewInterview
   *
   * The Interview instance used by the viewer app in preview mode.
   * this is set by viewer-preview-layout.stache bindings
   */
  previewInterview: {
    serialize: false
  },

  /**
   * @property {DefineMap} globalAlertProps
   *
   * This map holds some properties use to control the behavior of the
   * `app-alert` used to notify errors and other messages globally across
   * the different tabs
   */
  globalAlertProps: {
    serialize: false,
    default () {
      return {
        open: false,
        message: '',
        alertType: 'danger'
      }
    }
  },

  init () {
    const appState = this
    console.log(this)
    // TODO: this global can be removed when legacy code refactored out
    // used in window.form.htmlarea defined in A2J_Tabs.js & used in A2J_Pages.js
    window.ckeArea = ckeArea
    // TODO: remove this global when it's no longer references from legacy code
    window.gPrefs = appState.gPrefs

    // Add the legalNavStates to the window
    // So we can access this within the CKEditor widget
    this.setLegalNavStates()

    $(document).ajaxError(function globalAjaxHandler (event, jqxhr) {
      const status = jqxhr.status
      const response = jqxhr.responseJSON || {}

      if (status >= 400 && !_isEmpty(response.error)) {
        appState.globalAlertProps = {
          open: true,
          alertType: 'danger',
          message: response.error.message
        }
      }
    })

    // Check if we have a guide
    // if not navigate back to the interviews page
    // This is to fix issues with page reload not having the gGuide loaded
    setTimeout(() => {
      if (!appState.gGuide) {
        route.data.page = 'interviews'
        if (route.data.guideId) {
          route.data.guideId = ''
        }
        if (route.data.templateId) {
          route.data.templateId = ''
        }
      }
    }, 0)
  },

  // Fetch the list of available states for within the legalNav guid
  // Used in the CKEditor widget
  setLegalNavStates () {
    let states = []
    window.$.ajax({
      type: 'GET',
      dataType: 'json',
      url: `https://legalnav.org/wp-json/wp/v2/states`
    })
      .then((result) => {
        result.map((stateInfo) => states.push([stateInfo.name, stateInfo.slug]))
        window.legalNavStates = states
      })
      .catch((err) => console.error(err.responseJSON.message))
  },

  toggleDebugPanel () {
    const val = this.showDebugPanel
    this.showDebugPanel = !val
  }
})

import $ from 'jquery'
import CanList from 'can-list'
import DefineMap from 'can-define/map/map'
import GlobalPrefs from 'a2jauthor/src/models/global-preferences'
import constants from 'a2jauthor/src/models/constants'
import _isEmpty from 'lodash/isEmpty'
import ckeArea from '~/src/utils/ckeditor-area'
import Guide from 'a2jauthor/src/models/app-state-guide'
import route from 'can-route'
import 'can-map-define'

// !steal-remove-start
import debug from 'can-debug'
debug()
// !steal-remove-end

/**
 * @module {function} AuthorAppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default DefineMap.extend('AuthorAppState', {
  // Used to preserve and reset the Viewer Preview messageLog
  traceMessage: {
    serialize: false
  },

  resumeEdit (targetPageName) {
    // hide Viewer preview & return user to the Author `pages` tab.
    this.page = 'pages'

    targetPageName = targetPageName || this.previewPageName

    if (targetPageName) {
      // opens QDE modal
      const page = window.gGuide && window.gGuide.pages[targetPageName]

      // pages-tab.js does this same temporary legacy injection hack
      // so we don't have to refactor every single thing to use canjs,
      // instead this temproary hack lets us do more grainular upgrading over time.
      page && (window.canjs_LegacyModalPageEditFormInjection = {
        appState: this,
        page
      })

      const retval = window.gotoPageEdit(targetPageName)

      delete window.canjs_LegacyModalPageEditFormInjection

      return retval
    }
  },

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
   * @property {String} page
   *
   * The name of the "tab" the author is seeing, it is bound to can.route.
   *
   */
  page: {
    default: ''
  },

  /**
   * @property {Boolean} mergeTool
   *
   * Show the merge tool in the interviews page
   *
   */
  mergeTool: {
    serialize: false,
    type: 'boolean',
    value: function (prop) {
      prop.listenTo('page', (ev, page) => {
        prop.resolve(false)
        this.mergeTool = false
      })
      prop.listenTo(prop.lastSet, b => prop.resolve(!!b))
      prop.resolve(!!prop.lastSet.get())
    }
  },
  /**
  * @property {Promise} interviewsPromise
  *
  * list of interviewsPromise
  * used to refresh interviews list from merge-tool
  interviewsPromise: {
    serialize: false
  },
  */

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
      const guide = new Guide(gGuide)
      guide.runHealthCheck()
      return guide
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
    serialize: false
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

  modalTabView: {
    type: 'boolean',
    default: false,
    serialize: false
  },

  reloadInterviews: { serialize: false }, // function passed up from interviews-page

  init () {
    const appState = this
    // TODO: this global can be removed when legacy code refactored out
    // used in window.form.htmlarea defined in A2J_Tabs.js & used in A2J_Pages.js
    window.ckeArea = ckeArea
    // TODO: remove this global when it's no longer references from legacy code
    window.gPrefs = appState.gPrefs

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

  toggleDebugPanel () {
    const val = this.showDebugPanel
    this.showDebugPanel = !val
  }
})

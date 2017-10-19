import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import A2JVariable from './a2j-variable';
import _isEmpty from 'lodash/isEmpty';

// with the existing Guide model that works with a different data structure.
let Guide = Map.extend({
  define: {
    variablesList: {
      get() {
        let vars = this.attr('vars');
        return A2JVariable.fromGuideVars(vars.attr());
      }
    }
  }
});

/**
 * @module {function} AuthorAppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default Map.extend({
  define: {
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
     * @property {can.Map} interviews
     *
     * The available interviews shown to the Author
     *
     */
    interviews: {
      serialize: false
    },

    /**
     * @property {String} guideId
     *
     * The identifier to the guided interview currently loaded.
     */
    guideId: {
      serialize: false,
      value() {
        return window.gGuideID || '';
      }
    },

    /**
     * @property {String} guidePath
     *
     * The path to the folder where the Guide.xml file is located.
     */
    guidePath: {
      serialize: false,
      value() {
        return window.gGuidePath || '';
      }
    },

    /**
     * @property {can.Map} guide
     *
     * The current selected guided interview.
     */
    guide: {
      serialize: false,

      set(gGuide = {}) {
        return new Guide(gGuide);
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
      get(val) {
        let page = this.attr('page');
        return (page === 'preview') ? val : false;
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
      get(val) {
        let page = this.attr('page');
        return (page === 'preview') ? val : false;
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
      get() {
        return location.hostname === 'localhost' || location.hostname === 'staging.a2jauthor.org';
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
     * @property {String} viewerAlertMessages
     *
     * List of error messages meant to be displayed to the user (author) in
     * preview mode.
     */
    viewerAlertMessages: {
      Value: List,
      serialize: false
    },

    /**
     * @property {String} viewerInterview
     *
     * The Interview instance used by the viewer app in preview mode.
     */
    viewerInterview: {
      serialize: false,
      set (val) {
        return val;
      }
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
      value() {
        return {
          open: false,
          message: '',
          alertType: 'danger'
        };
      }
    }
  },

  init() {
    let appState = this;

    $(document).ajaxError(function globalAjaxHandler(event, jqxhr) {
      let status = jqxhr.status;
      let response = jqxhr.responseJSON || {};

      if (status >= 400 && !_isEmpty(response.error)) {
        appState.attr('globalAlertProps', {
          open: true,
          alertType: 'danger',
          message: response.error.message
        });
      }
    });
  },

  toggleDebugPanel() {
    let val = this.attr('showDebugPanel');
    this.attr('showDebugPanel', !val);
  }
});

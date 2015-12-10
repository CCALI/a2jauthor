import Map from 'can/map/';
import List from 'can/list/';

import 'can/map/define/';

/**
 * @module {function} author/models/app-state AppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default Map.extend({

  define: {
    /**
    * @property {List} AppState.property.traceLogic
    *
    * latest message to display in the trace panel
    */
    traceLogic: {
      serialize: false
    },

    /**
     * @property {String} AppState.prototype.page page
     *
     * The name of the "tab" the author is seeing, it is bound to can.route.
     *
     */
    page: {
      value: ''
    },

    /**
     * @property {String} AppState.prototype.guideId guideId
     *
     * The identifier to the guided interview currently loaded.
     */
    guideId: {
      serialize: false,
      value: window.gGuideID || ''
    },

    /**
     * @property {can.Map} AppState.prototype.guide guide
     *
     * The current selected guided interview.
     */
    guide: {
      Value: Map,
      serialize: false
    },

    /**
     * @property {Boolean} AppState.prototype.showDebugPanel showDebugPanel
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
     * @property {Boolean} AppState.protoype.previewMode previewMode
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
     * @property {String} AppState.protoype.previewPageName previewPageName
     *
     * The name of the page that will be loaded when user clicks the interview
     * button in the edit page popup, when empty the first page of the interview
     * will be loaded.
     */
    previewPageName: {
      value: '',
      serialize: false
    },

    /**
     * @property {String} AppState.protoype.interviewPageName interviewPageName
     *
     * The name of the page that is currently being previewed in the viewer
     * app, it is bound to viewer's route page property.
     */
    interviewPageName: {
      value: '',
      serialize: false
    },

    /**
     * @property {String} AppState.protoype.viewerAlertMessages viewerAlertMessages
     *
     * List of error messages meant to be displayed to the user (author) in
     * preview mode.
     */
    viewerAlertMessages: {
      Value: List,
      serialize: false
    },

    /**
     * @property {String} AppState.protoype.viewerInterview viewerInterview
     *
     * The Interview instance used by the viewer app in preview mode.
     */
    viewerInterview: {
      serialize: false
    }
  },

  toggleDebugPanel() {
    let val = this.attr('showDebugPanel');
    this.attr('showDebugPanel', !val);
  }
});

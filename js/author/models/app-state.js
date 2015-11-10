import Map from 'can/map/';
import List from 'can/list/';

import 'can/map/define/';

/**
 * @module {function} AppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default Map.extend({

  define: {
    page: {
      value: ''
    },

    /**
     * @property {String} AppState.prototype.guideId
     *
     * The identifier to the guided interview currently loaded.
     */
    guideId: {
      serialize: false,
      value: window.gGuideID || ''
    },

    /**
     * @property {Boolean} AppState.prototype.showDebugPanel
     *
     * Whether to show the debug panel (variables and trace panels) when
     * the author is previewing the interview.
     */
    showDebugPanel: {
      value: false,
      serialize: false
    },

    /**
     * @property {Boolean} AppState.protoype.previewMode
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
     * @property {String} AppState.protoype.previewPageName
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
     * @property {String} AppState.protoype.interviewPageName
     *
     * The name of the page that is currently being previewed in the viewer
     * app, it is bound to viewer's route page property.
     */
    interviewPageName: {
      value: '',
      serialize: false
    },

    /**
     * @property {String} AppState.protoype.viewerAlertMessages
     *
     * List of error messages meant to be displayed to the user (author) in
     * preview mode.
     */
    viewerAlertMessages: {
      Value: List,
      serialize: false
    }
  },

  toggleDebugPanel() {
    let val = this.attr('showDebugPanel');
    this.attr('showDebugPanel', !val);
  }
});

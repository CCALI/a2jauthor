import Map from 'can/map/';

import 'can/map/define/';

/**
 * @module {function} AppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default Map.extend({
  page: {
    value: ''
  },

  define: {
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
    }
  }
});

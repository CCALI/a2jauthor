import Map from 'can/map/';

import 'can/map/define/';

/**
 * @module AppState
 * @parent api-models
 *
 * This is the global application state.
 */
export default Map.extend({
  define: {
    /**
     * @property {String} guideId
     *
     * The identifier to the guided interview currently loaded.
     */
    guideId: {
      serialize: false,
      value: window.gGuideID || ''
    }
  }
});

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
     * @property {String} guide_id
     *
     * The identifier to the guided interview currently loaded.
     */
    guide_id: {
      value: window.gGuideID || ''
    }
  }
});

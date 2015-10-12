import Map from 'can/map/';

import 'can/map/define/';

export default Map.extend({
  define: {
    showCredits: {
      value: false
    },

    templateURL: {
      set: function(val) {
        val = val.replace(/\.xml/, '.json');
        return val;
      }
    }
  }
});

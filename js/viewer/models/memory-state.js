import Map from 'can/map/'

import 'can/map/define/'

export default Map.extend({
  define: {
    showCredits: {
      value: false
    },

    // overrides the interview 'avatar' property.
    // possible values are: lighter, light, medium, dark or darker.
    avatarSkinTone: {
      value: null
    },

    templateURL: {
      set: function (val) {
        val = val.replace(/\.xml/, '.json')
        return val
      }
    }
  }
})

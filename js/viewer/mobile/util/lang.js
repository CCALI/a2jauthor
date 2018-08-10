import DefineMap from 'can-define/map/map'
import TLang from 'caja/viewer/mobile/util/tlang'
import cString from 'caja/viewer/mobile/util/string'

export default DefineMap.extend({
  setup: function (id) {
    var o = {}

    TLang(o, cString.makestr.bind(cString)).set(id)
    return DefineMap.prototype.setup.call(this, o)
  }
})

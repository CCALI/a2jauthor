import CanMap from 'can-map';
import TLang from 'caja/viewer/mobile/util/tlang'
import cString from 'caja/viewer/mobile/util/string'

export default CanMap.extend({
  init: function (id) {
    var o = {}

    TLang(o, cString.makestr.bind(cString)).set(id)
    this.attr(o)
  }
})

import Map from 'can/map/';
import TLang from 'viewer/mobile/util/tlang';
import cString from 'viewer/mobile/util/string';

export default Map.extend({
  init: function(id) {
    var o = {};

    TLang(o, can.proxy(cString.makestr, cString)).set(id);
    this.attr(o);
  }
});

import Map from 'can/map/';
import TLang from 'client/util/tlang';
import cString from 'client/util/string';

export default Map.extend({
  init: function(id) {
    var o = {};

    TLang(o, can.proxy(cString.makestr, cString)).set(id);
    this.attr(o);
  }
});

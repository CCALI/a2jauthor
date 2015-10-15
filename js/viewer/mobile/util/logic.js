import Map from 'can/map/';
import regex from 'viewer/mobile/util/regex';
import tLogic from 'viewer/mobile/util/tlogic';
import cString from 'viewer/mobile/util/string';
import Infinite from 'viewer/mobile/util/infinite';
import constants from 'viewer/mobile/models/constants';

import 'can/map/define/';

export default Map.extend({
  define: {
    gotoPage: {
      get: function() {
        return this._tLogic.GOTOPAGE;
      },

      set: function(val) {
        this._tLogic.GOTOPAGE = val;
      }
    },

    infinite: {
      Type: Infinite,
      Value: Infinite
    }
  },

  init: function() {
    let guide = this.attr('interview').createGuide();

    let stringMethods = ['decodeEntities', 'htmlEscape', 'jsDate2days',
      'today2jsDate', 'mdy2jsDate', 'days2jsDate', 'ismdy', 'jquote'];

    let traceMethods = ['traceTag'];
    let methods = [guide, regex, constants];

    can.each(stringMethods, function(fn) {
      methods.push(can.proxy(cString[fn], cString));
    });

    can.each(traceMethods, function(fn) {
      methods.push(function() {});
    });

    this._tLogic = tLogic.apply(this, methods);

    //TODO: This exposure is due to creating a function on the fly within
    //tlogic.js, line 539
    window.gLogic = this._tLogic;
  },

  eval: function(str) {
    var output = this._tLogic.evalLogicHTML(str);

    return output.html;
  },

  exec: function(cajascript) {
    return this._tLogic.executeScript(cajascript);
  }
});

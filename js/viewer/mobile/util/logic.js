import Map from 'can/map/';
import regex from 'viewer/mobile/util/regex';
import tLogic from 'viewer/mobile/util/tlogic';
import Lang from 'viewer/mobile/util/lang';
import cString from 'viewer/mobile/util/string';
import constants from 'viewer/models/constants';
import Infinite from 'viewer/mobile/util/infinite';

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
    this.guide = this.attr('interview').createGuide();

    let stringMethods = ['decodeEntities', 'htmlEscape', 'jsDate2days',
      'today2jsDate', 'mdy2jsDate', 'days2jsDate', 'ismdy', 'jquote'];

    let traceMethods = ['traceTag'];
    let methods = [this.guide, regex, constants];

    can.each(stringMethods, function(fn) {
      methods.push(can.proxy(cString[fn], cString));
    });

    can.each(traceMethods, function() {
      methods.push(function() {});
    });

    this._tLogic = tLogic.apply(this, methods);

    //TODO: This exposure is due to creating a function on the fly within
    //tlogic.js, line 539
    window.gLogic = this._tLogic;

    // Exposed `lang` is required in mobile/util/tlogic.js
    var langID = this.attr('interview').language;
    window.lang = new Lang(langID);
  },

  eval: function(str) {
    var output = this._tLogic.evalLogicHTML(str);

    return output.html;
  },

  exec: function(cajascript) {
    return this._tLogic.executeScript(cajascript);
  },

  varExists(...args) {
    return this.guide.varExists(...args);
  },

  varCreate(...args) {
    return this.guide.varCreate(...args);
  },

  varSet(...args) {
    return this.guide.varSet(...args);
  },

  varGet(...args) {
    return this.guide.varGet(...args);
  }
});

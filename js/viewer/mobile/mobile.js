import Map from 'can/map/';
import Component from 'can/component/';
import template from './mobile.stache!';

import 'viewer/mobile/pages/';
import 'viewer/mobile/intro/';
import 'viewer/mobile/header/';
import 'viewer/mobile/footer/';
import 'viewer/mobile/filler/';

let MobileViewerVM = Map.extend({
  hideCredits: function() {
    this.attr('mState.showCredits', false);
  }
});

// ScreenManager is to handle which view is currently on the screen. Also,
// if we add any animations on bringing views into the viewport, we'll add that here.
export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-mobile-viewer',
  viewModel: MobileViewerVM,

  helpers: {
    tocOrCreditsShown: function(options) {
      let showToc = this.attr('mState.showToc');
      let showCredits = this.attr('mState.showCredits');

      return (showCredits || showToc) ? options.fn() : options.inverse();
    },

    eval: function(str) {
      str = typeof str === 'function' ? str() : str;
      return this.attr('logic').eval(str);
    },

    i11n: function(key) {
      key = typeof key === 'function' ? key() : key;
      return this.attr('lang.' + key);
    }
  }
});

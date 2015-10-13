import Map from 'can/map/';
import Component from 'can/component/';
import template from './screen-manager.stache!';

import 'client/pages/';
import 'client/intro/';
import 'client/header/';
import 'client/footer/';
import 'client/filler/';

let ScreenManagerVM = Map.extend({
  hideCredits: function() {
    this.attr('mState.showCredits', false);
  }
});

// ScreenManager is to handle which view is currently on the screen. Also,
// if we add any animations on bringing views into the viewport, we'll add that here.
export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-screen-manager',
  viewModel: ScreenManagerVM,

  helpers: {
    tocOrCreditsShown: function(options) {
      return this.attr('mState.showCredits') || this.attr('mState.showToc') ? options.fn() : options.inverse();
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


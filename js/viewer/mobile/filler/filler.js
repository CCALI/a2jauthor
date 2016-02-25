import Control from 'can/control/';

import 'can/view/';

export default Control.extend({
  init: function() {
    this._calc();
  },

  _calc: function() {
    let offset = this.element.offset();
    let height = $(window).height() - offset.top;

    this.element.height(height);
  },

  '{window} resize': function() {
    this._calc();
  }
});

// Expose an additional html attr for easy access
can.view.attr('filler', function(el) {
  new Filler(el);
});

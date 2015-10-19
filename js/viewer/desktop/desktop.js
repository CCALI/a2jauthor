import Map from 'can/map/';
import Component from 'can/component/';
import template from './desktop.stache!';

import 'can/map/define/';

let DesktopViewerVM = Map.extend({
  define: {},

  init() {
    let routeState = this.attr('rState');

    if (routeState) {
      let view = routeState.attr('view');
      let interview = this.attr('interview');

      if (view === 'intro') {
        routeState.attr({
          view: 'pages',
          page: interview.attr('firstPage')
        });
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-desktop-viewer',
  viewModel: DesktopViewerVM,

  helpers: {
    eval: function(str) {
      str = typeof str === 'function' ? str() : str;
      return this.attr('logic').eval(str);
    }
  }
});

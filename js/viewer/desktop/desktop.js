import Map from 'can/map/';
import Component from 'can/component/';
import template from './desktop.stache!';
import _isUndefined from 'lodash/lang/isUndefined';

import 'can/map/define/';

let DesktopViewerVM = Map.extend({
  define: {
    pageNotFound: {
      value: false
    }
  },

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

      this.checkPageExists();
    }
  },

  checkPageExists() {
    let routeState = this.attr('rState');
    let interview = this.attr('interview');

    if (!routeState || !interview) return;

    let view = routeState.attr('view');
    let pageName = routeState.attr('page');

    if (view === 'pages') {
      let page = interview.attr('pages').find(pageName);
      this.attr('pageNotFound', _isUndefined(page));
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
  },

  events: {
    '{rState} page': function() {
      this.viewModel.checkPageExists();
    }
  }
});

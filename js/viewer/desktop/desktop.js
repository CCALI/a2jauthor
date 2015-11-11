import Map from 'can/map/';
import Component from 'can/component/';
import template from './desktop.stache!';
import _isUndefined from 'lodash/lang/isUndefined';

import 'can/map/define/';

let DesktopViewerVM = Map.extend({
  define: {
    pageNotFound: {
      value: false
    },

    showDemoNotice: {
      value: false
    },

    authorBrandLogo: {
      get() {
        return this.attr('interview.logoImage');
      }
    },

    authorCourthouseImage: {
      get() {
        return this.attr('interview.endImage');
      }
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
    },

    // Keep fully qualified web path, otherwise default to file within
    // interview's folder.
    normalizePath(path) {
      if (path.indexOf('http') === 0) return path;

      let fileName = path.split('/').pop();
      let filesPath = this.attr('mState.fileDataUrl');
      let interviewPath = this.attr('interview.interviewPath');

      return filesPath
        ? filesPath + fileName
        : interviewPath + fileName;
    }
  },

  events: {
    inserted() {
      let vm = this.viewModel;
      let location = window.location.toString();
      vm.attr('showDemoNotice', location.indexOf('.a2jauthor.org') !== -1);
    },

    '{rState} page': function() {
      this.viewModel.checkPageExists();
    }
  }
});

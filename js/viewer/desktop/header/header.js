import Map from 'can/map/';
import Component from 'can/component/';
import template from './header.stache!';
import _findIndex from 'lodash/array/findIndex';

import 'can/map/define/';

export let ViewerHeaderVM = Map.extend({
  define: {
    visitedPages: {
      get() {
        let state = this.attr('appState');
        return state.attr('visitedPages');
      }
    },

    canNavigateBack: {
      get() {
        let pages = this.attr('visitedPages');
        let totalPages = pages.attr('length');
        let pageName = this.attr('selectedPageName');
        let pageIndex = this.getPageIndex(pageName);
        return totalPages > 1 && pageIndex < totalPages - 1;
      }
    },

    canNavigateForward: {
      get() {
        let pages = this.attr('visitedPages');
        let totalPages = pages.attr('length');
        let pageName = this.attr('selectedPageName');
        let pageIndex = this.getPageIndex(pageName);
        return totalPages > 1 && pageIndex > 0;
      }
    },

    selectedPageName: {
      get(pageName) {
        let pages = this.attr('visitedPages');
        return pageName ? pageName : pages.attr('0.name');
      }
    }
  },

  getPageIndex(pageName) {
    let pages = this.attr('visitedPages');

    return _findIndex(pages, function(page) {
      return page.attr('name') === pageName;
    });
  },

  navigateBack() {
    let pages = this.attr('visitedPages');
    let pageName = this.attr('selectedPageName');
    let pageIndex = this.getPageIndex(pageName);
    let prevPage = pages.attr(pageIndex + 1);

    this.attr('selectedPageName', prevPage.attr('name'));
  },

  navigateForward() {
    let pages = this.attr('visitedPages');
    let pageName = this.attr('selectedPageName');
    let pageIndex = this.getPageIndex(pageName);
    let nextPage = pages.attr(pageIndex - 1);

    this.attr('selectedPageName', nextPage.attr('name'));
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-viewer-header',
  viewModel: ViewerHeaderVM,

  helpers: {
    stripTags(text) {
      text = text.isComputed ? text() : text;
      return text.replace(/(<([^>]+)>)/ig, '');
    }
  },

  events: {
    '{visitedPages} length': function() {
      let vm = this.viewModel;
      let pages = vm.attr('visitedPages');
      vm.attr('selectedPageName', pages.attr('0.name'));
    },

    '{viewModel} selectedPageName': function() {
      let vm = this.viewModel;
      let state = vm.attr('appState');
      let pageName = vm.attr('selectedPageName');
      state.attr('page', pageName);
    }
  }
});

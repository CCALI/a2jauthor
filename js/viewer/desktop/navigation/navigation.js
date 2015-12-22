import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import _trunc from 'lodash/string/trunc';
import template from './navigation.stache!';
import constants from 'viewer/models/constants';
import _findIndex from 'lodash/array/findIndex';

import 'can/map/define/';

export let ViewerNavigationVM = Map.extend({
  define: {
    visitedPages: {
      get() {
        let state = this.attr('appState');
        return state.attr('visitedPages');
      }
    },

    selectedPageName: {
      get(pageName) {
        let pages = this.attr('visitedPages');
        return pageName ? pageName : pages.attr('0.name');
      }
    },

    selectedPageIndex: {
      set(newVal) {
        let selectedPage = this.attr('visitedPages').attr(newVal);
        let selectedPageName = selectedPage.attr('name');

        let repeatVar = selectedPage.attr('repeatVar');
        let repeatVarValue = selectedPage.attr('repeatVarValue');
        if (repeatVar && repeatVarValue) {
          this.attr('appState.repeatVarValue', selectedPage.repeatVarValue);
          this.attr('logic').varSet(repeatVar, repeatVarValue);
        }

        this.attr('selectedPageName', selectedPageName);

        return newVal;
      }
    },

    canSaveAndExit: {
      get() {
        let appState = this.attr('appState');
        let interview = this.attr('interview');

        return !appState.attr('saveAndExitActive') &&
          interview.attr('exitPage') !== constants.qIDNOWHERE;
      }
    },

    canResumeInterview: {
      get() {
        let appState = this.attr('appState');

        return appState.attr('saveAndExitActive') &&
          appState.attr('lastPageBeforeExit');
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

    feedbackData: {
      type: '*',
      get() {
        let interview = this.attr('interview');
        let pageName = this.attr('selectedPageName');
        let pages = interview.attr('pages');
        let page = pages.find(pageName);

        if (!page) return {};

        return {
          questionid: page.attr('name'),
          questiontext: page.attr('text'),
          interviewid: interview.attr('version'),
          viewerversion: constants.A2JVersionNum,
          emailto: interview.attr('emailContact'),
          interviewtitle: interview.attr('title')
        };
      }
    }
  },

  getPageIndex(pageName) {
    let pages = this.attr('visitedPages');

    return _findIndex(pages, function(page) {
      return page.attr('name') === pageName;
    });
  },

  saveAndExit() {
    let appState = this.attr('appState');
    let interview = this.attr('interview');
    let exitPage = interview.attr('exitPage');
    let pageName = this.attr('selectedPageName');

    appState.attr('saveAndExitActive', true);
    appState.attr('lastPageBeforeExit', pageName);

    this.attr('selectedPageName', exitPage);
  },

  resumeInterview() {
    let appState = this.attr('appState');
    let lastPageName = appState.attr('lastPageBeforeExit');

    appState.attr('lastPageBeforeExit', '');
    appState.attr('saveAndExitActive', false);

    this.attr('selectedPageName', lastPageName);
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
  tag: 'a2j-viewer-navigation',
  viewModel: ViewerNavigationVM,

  helpers: {
    feedbackFormUrl() {
      let feedbackData = this.attr('feedbackData');
      let baseUrl = 'http://www.a2jauthor.org/A2JFeedbackForm.php?';
      return baseUrl + $.param(feedbackData);
    },

    fitPageDescription(text, repeatVarValue) {
      text = text.isComputed ? text() : text;

      // strip html tags
      text = text.replace(/(<([^>]+)>)/ig, '').trim();

      // truncate text to avoid https://github.com/CCALI/CAJA/issues/685
      text = _trunc(text, {length: 40, separator: ' '});
      text = (typeof repeatVarValue === "number") ? text + '#' + repeatVarValue : text;

      return text;
    }
  },

  events: {
    /*
    * select most recently visited page in selectedPageIndex dropdown
    */
    '{visitedPages} length': function(pages) {
      this.viewModel.attr('selectedPageIndex', 0);
    }
  }
});

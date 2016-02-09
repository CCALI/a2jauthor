import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import _truncate from 'lodash/truncate';
import _findIndex from 'lodash/findIndex';
import template from './navigation.stache!';
import constants from 'viewer/models/constants';

import 'can/map/define/';

/**
 * @property {can.Map} viewerNavigation.ViewModel
 * @parent <a2j-viewer-navigation>
 *
 * `<a2j-viewer-navigation>`'s viewModel.
 */
export let ViewerNavigationVM = Map.extend({
  define: {
    /**
     * @property {can.List} viewerNavigation.ViewModel.visitedPages visitedPages
     * @parent viewerNavigation.ViewModel
     *
     * list of pages visited by the user.
     */
    visitedPages: {
      get() {
        let state = this.attr('appState');
        return state.attr('visitedPages');
      }
    },

    /**
     * @property {String} viewerNavigation.ViewModel.selectedPageName selectedPageName
     * @parent viewerNavigation.ViewModel
     *
     * Name of currently selected page.
     */
    selectedPageName: {
      get(pageName) {
        let pages = this.attr('visitedPages');
        return pageName ? pageName : pages.attr('0.name');
      }
    },

    /**
     * @property {Number} viewerNavigation.ViewModel.selectedPageIndex selectedPageIndex
     * @parent viewerNavigation.ViewModel
     *
     * Index of currently selected page.
     *
     * Used for navigating between pages since the same page may appear multiple
     * times in `visitedPages` list if user is navigating through a repeat loop.
     */
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

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canSaveAndExit canSaveAndExit
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can save and exit interview.
     */
    canSaveAndExit: {
      get() {
        let appState = this.attr('appState');
        let interview = this.attr('interview');

        return !appState.attr('saveAndExitActive') &&
          interview.attr('exitPage') !== constants.qIDNOWHERE;
      }
    },

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canResumeInterview canResumeInterview
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can resume interview.
     */
    canResumeInterview: {
      get() {
        let appState = this.attr('appState');

        return appState.attr('saveAndExitActive') &&
          appState.attr('lastPageBeforeExit');
      }
    },

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canNavigateBack canNavigateBack
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can navigate to the previous page.
     */
    canNavigateBack: {
      get() {
        let pages = this.attr('visitedPages');
        let totalPages = pages.attr('length');
        let pageName = this.attr('selectedPageName');
        let pageIndex = this.getPageIndex(pageName);
        return totalPages > 1 && pageIndex < totalPages - 1;
      }
    },

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canNavigateForward canNavigateForward
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can navigate to the next page.
     */
    canNavigateForward: {
      get() {
        let pages = this.attr('visitedPages');
        let totalPages = pages.attr('length');
        let pageName = this.attr('selectedPageName');
        let pageIndex = this.getPageIndex(pageName);
        return totalPages > 1 && pageIndex > 0;
      }
    },

    /**
     * @property {Object} viewerNavigation.ViewModel.feedbackData feedbackData
     * @parent viewerNavigation.ViewModel
     *
     * Data to be submitted when user sends feedback.
     */
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

  /**
   * @property {Function} viewerNavigation.ViewModel.getPageIndex getPageIndex
   * @parent viewerNavigation.ViewModel
   *
   * @return {Number} index of current page.
   */
  getPageIndex(pageName) {
    let pages = this.attr('visitedPages');

    return _findIndex(pages, function(page) {
      return page.attr('name') === pageName;
    });
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.saveAndExit saveAndExit
   * @parent viewerNavigation.ViewModel
   *
   * Saves interview and exits.
   */
  saveAndExit() {
    let appState = this.attr('appState');
    let interview = this.attr('interview');
    let exitPage = interview.attr('exitPage');
    let pageName = this.attr('selectedPageName');

    appState.attr('saveAndExitActive', true);
    appState.attr('lastPageBeforeExit', pageName);

    this.attr('selectedPageName', exitPage);
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.resumeInterview resumeInterview
   * @parent viewerNavigation.ViewModel
   *
   * Resumes saved interview.
   */
  resumeInterview() {
    let appState = this.attr('appState');
    let lastPageName = appState.attr('lastPageBeforeExit');

    appState.attr('lastPageBeforeExit', '');
    appState.attr('saveAndExitActive', false);

    this.attr('selectedPageName', lastPageName);
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.navigateBack navigateBack
   * @parent viewerNavigation.ViewModel
   *
   * Navigates to previous page.
   */
  navigateBack() {
    let pages = this.attr('visitedPages');
    let pageName = this.attr('selectedPageName');
    let pageIndex = this.getPageIndex(pageName);
    let prevPage = pages.attr(pageIndex + 1);

    this.attr('selectedPageName', prevPage.attr('name'));
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.navigateForward navigateForward
   * @parent viewerNavigation.ViewModel
   *
   * Navigates to next page.
   */
  navigateForward() {
    let pages = this.attr('visitedPages');
    let pageName = this.attr('selectedPageName');
    let pageIndex = this.getPageIndex(pageName);
    let nextPage = pages.attr(pageIndex - 1);

    this.attr('selectedPageName', nextPage.attr('name'));
  }
});

/**
 * @module {Module} viewer/desktop/navigation/ <a2j-viewer-navigation>
 * @parent api-components
 *
 * This component displays the navigation bar for the viewer app.
 *
 * ## Use
 *
 * @codestart
 * <a2j-viewer-navigation>
 *   {(selected-page-name)}="rState.page"
 *   {(app-state)}="rState"
 *   {(interview)}="interview">
 * </a2j-viewer-navigation>
 * @codeend
 */
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
      text = _truncate(text, {length: 40, separator: ' '});
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

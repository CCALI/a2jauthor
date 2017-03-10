import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import _truncate from 'lodash/truncate';
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

    alreadyVisitedPageIndex: {
      type: 'number',
      get(newVal) {
        return newVal || 0;
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
     *
     * `pageIndex === totalPages - 1` is the first page.
     * `pageIndex === 0` is the last page (most recent).
     */
    selectedPageIndex: {
      type: 'number',
      set(newVal) {
        const appState = this.attr('appState');
        const selectedPage = this.attr('visitedPages').attr(newVal);
        const selectedPageName = selectedPage.attr('name');

        if (selectedPageName !== appState.attr('page')) {
          appState.attr({
            page: selectedPageName,
            forceNavigation: true
          });
        }

        // if user changes page using the dropdown,
        // restore repeatVarValue of loop being navigated to
        // as well as it's associated outerLoopVarValue if it exists
        const repeatVar = selectedPage.attr('repeatVar');
        const repeatVarValue = selectedPage.attr('repeatVarValue');
        const outerLoopVar = selectedPage.attr('outerLoopVar');
        const outerLoopVarValue = selectedPage.attr('outerLoopVarValue');

        if (repeatVar && repeatVarValue) {
          this.attr('appState.repeatVarValue', repeatVarValue);
          this.attr('logic').varSet(repeatVar, repeatVarValue);
        }

        if (outerLoopVar && outerLoopVarValue) {
          this.attr('appState.outerLoopVarValue', outerLoopVarValue);
          this.attr('logic').varSet(outerLoopVar, outerLoopVarValue);
        }

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
          !!appState.attr('lastPageBeforeExit');
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
        let totalPages = this.attr('visitedPages.length');
        let pageIndex = this.attr('selectedPageIndex');

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
        let totalPages = this.attr('visitedPages.length');
        let pageIndex = this.attr('selectedPageIndex');

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
   * @property {Function} viewerNavigation.ViewModel.saveAndExit saveAndExit
   * @parent viewerNavigation.ViewModel
   *
   * Saves interview and exits.
   */
  saveAndExit() {
    let appState = this.attr('appState');
    let interview = this.attr('interview');
    let answers = interview.attr('answers');
    let exitPage = interview.attr('exitPage');
    let pageName = this.attr('selectedPageName');

    appState.attr('saveAndExitActive', true);
    appState.attr('lastPageBeforeExit', pageName);

    if (answers) {
      answers.attr('a2j interview incomplete tf').attr('values.1', true);
    }

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
    let interview = this.attr('interview');
    let answers = interview.attr('answers');
    let visitedPages = appState.attr('visitedPages');

    appState.attr('saveAndExitActive', false);
    appState.attr('lastPageBeforeExit', null);

    // Special Exit page should only show in My Progress while on that page
    visitedPages.shift();

    if (answers) {
      answers.attr('a2j interview incomplete tf').attr('values', [null]);
    }

    this.attr('selectedPageName', lastPageName);
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.navigateBack navigateBack
   * @parent viewerNavigation.ViewModel
   *
   * Navigates to previous page.
   */
  navigateBack() {
    this.attr('selectedPageIndex', this.attr('selectedPageIndex') + 1);
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.navigateForward navigateForward
   * @parent viewerNavigation.ViewModel
   *
   * Navigates to next page.
   */
  navigateForward() {
    this.attr('selectedPageIndex', this.attr('selectedPageIndex') - 1);
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
      let baseUrl = 'http://www.a2jauthor.org/app/A2JFeedbackForm.php?';
      return baseUrl + $.param(feedbackData);
    },

    fitPageDescription(text, repeatVarValue) {
      text = text.isComputed ? text() : text;

      // strip html tags
      text = text.replace(/(<([^>]+)>)/ig, '').trim();

      // truncate text to avoid https://github.com/CCALI/CAJA/issues/685
      text = _truncate(text, {length: 40, separator: ' '});
      text = (typeof repeatVarValue === 'number') ? text + '#' + repeatVarValue : text;

      return text;
    }
  },

  events: {
    /*
    * select most recently visited page in selectedPageIndex dropdown
    */
    '{visitedPages} length': function() {
      this.viewModel.attr('selectedPageIndex', 0);
    },

    '{visitedPages} revisited': function(map, ev, selectedIndex) {
      this.viewModel.attr('alreadyVisitedPageIndex', selectedIndex);
    }
  }
});

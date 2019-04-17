import $ from 'jquery'
import CanMap from 'can-map'
import Component from 'can-component'
import _truncate from 'lodash/truncate'
import template from './navigation.stache'
import constants from 'caja/viewer/models/constants'
import { Analytics } from 'caja/viewer/util/analytics'
import isMobile from 'caja/viewer/is-mobile'

import 'can-map-define'
import 'jquerypp/event/swipe/'

/**
 * @property {can.Map} viewerNavigation.ViewModel
 * @parent <a2j-viewer-navigation>
 *
 * `<a2j-viewer-navigation>`'s viewModel.
 */
export let ViewerNavigationVM = CanMap.extend({
  define: {
    // passed in via stache bindings
    courthouseImage: {},
    interview: {},
    repeatVarValue: {},
    selectedPageName: {},
    selectedPageIndex: {},
    lang: {},

    /**
     * @property {can.compute} viewerNavigation.ViewModel.isMobile isMobile
     *
     * used to detect mobile viewer loaded
     *
     * */
    isMobile: {
      get () {
        return isMobile()
      }
    },

    /**
     * @property {DefineList} viewerNavigation.ViewModel.visitedPages visitedPages
     * @parent viewerNavigation.ViewModel
     *
     * list of pages visited by the user.
     */
    visitedPages: {
      get () {
        return this.attr('appState').visitedPages
      }
    },

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canSaveAndExit canSaveAndExit
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can save and exit interview.
     */
    canSaveAndExit: {
      get () {
        let appState = this.attr('appState')
        let interview = this.attr('interview')

        return !appState.saveAndExitActive &&
          interview.attr('exitPage') !== constants.qIDNOWHERE
      }
    },

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canResumeInterview canResumeInterview
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can resume interview.
     */
    canResumeInterview: {
      get () {
        let appState = this.attr('appState')

        return appState.saveAndExitActive && !!appState.lastPageBeforeExit
      }
    },

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canNavigateBack canNavigateBack
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can navigate to the previous page.
     */
    canNavigateBack: {
      get () {
        let appState = this.attr('appState')
        let totalPages = this.attr('visitedPages.length')
        let pageIndex = this.attr('selectedPageIndex')

        return totalPages > 1 && pageIndex < totalPages - 1 && !appState.saveAndExitActive
      }
    },

    /**
     * @property {Boolean} viewerNavigation.ViewModel.canNavigateForward canNavigateForward
     * @parent viewerNavigation.ViewModel
     *
     * Whether user can navigate to the next page.
     */
    canNavigateForward: {
      get () {
        let appState = this.attr('appState')
        let totalPages = this.attr('visitedPages.length')
        let pageIndex = this.attr('selectedPageIndex')

        return totalPages > 1 && pageIndex > 0 && !this.canSaveAndExit && !appState.saveAndExitActive
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
      get () {
        let interview = this.attr('interview')
        let pageName = this.attr('selectedPageName')
        let pages = interview.attr('pages')
        let page = pages.find(pageName)

        if (!page) return {}

        return {
          questionid: page.attr('name'),
          questiontext: page.attr('text'),
          interviewid: interview.attr('version'),
          viewerversion: constants.A2JVersionNum,
          emailto: interview.attr('emailContact'),
          interviewtitle: interview.attr('title')
        }
      }
    },

    showDemoNotice: {
      type: 'boolean'
    }
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.saveAndExit saveAndExit
   * @parent viewerNavigation.ViewModel
   *
   * Saves interview and exits.
   */
  saveAndExit () {
    let appState = this.attr('appState')
    let interview = this.attr('interview')
    let answers = interview.attr('answers')
    let exitPage = interview.attr('exitPage')
    let pageName = this.attr('selectedPageName')

    appState.lastPageBeforeExit = pageName

    if (window._paq) {
      Analytics.trackCustomEvent('Save&Exit', 'from: ' + pageName)
    }

    if (answers) {
      answers.attr('a2j interview incomplete tf').attr('values.1', true)
    }

    appState.page = exitPage
    appState.selectedPageIndex = 0
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.resumeInterview resumeInterview
   * @parent viewerNavigation.ViewModel
   *
   * Resumes saved interview.
   */
  resumeInterview () {
    let appState = this.attr('appState')
    let lastPageName = appState.lastPageBeforeExit
    let interview = this.attr('interview')
    let answers = interview.attr('answers')
    let visitedPages = appState.visitedPages

    appState.lastPageBeforeExit = null

    // Special Exit page should only show in My Progress while on that page
    visitedPages.shift()

    if (answers) {
      answers.attr('a2j interview incomplete tf').attr('values', [null])
    }

    if (window._paq) {
      Analytics.trackCustomEvent('Resume-Interview', 'to: ' + lastPageName)
    }
    appState.page = lastPageName
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.navigateBack navigateBack
   * @parent viewerNavigation.ViewModel
   *
   * Navigates to previous page.
   */
  navigateBack () {
    if (this.attr('canNavigateBack')) {
      this.attr('selectedPageIndex', parseInt(this.attr('selectedPageIndex')) + 1)
    }
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.navigateForward navigateForward
   * @parent viewerNavigation.ViewModel
   *
   * Navigates to next page.
   */
  navigateForward () {
    if (this.attr('canNavigateForward')) {
      this.attr('selectedPageIndex', parseInt(this.attr('selectedPageIndex')) - 1)
    }
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.disableOption disableOption
   * @parent viewerNavigation.ViewModel
   *
   * Used to disable My Progress options when saveAndExit is active
   */
  disableOption (index) {
    if (index !== 0 && this.attr('appState').saveAndExitActive) {
      return true
    }
    return false
  }
})
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
  view: template,
  leakScope: false,
  tag: 'a2j-viewer-navigation',
  ViewModel: ViewerNavigationVM,

  helpers: {
    feedbackFormUrl () {
      let feedbackData = this.attr('feedbackData')
      let baseUrl = 'http://www.a2jauthor.org/A2JFeedbackForm.php?'
      return baseUrl + $.param(feedbackData)
    },

    fitPageDescription (text, repeatVarValue) {
      // strip html tags
      text = text.replace(/(<([^>]+)>)/ig, '').trim()

      // truncate text to avoid https://github.com/CCALI/CAJA/issues/685
      text = _truncate(text, { length: 40, separator: ' ' })
      text = (typeof repeatVarValue === 'number') ? text + ' #' + repeatVarValue : text

      return text
    }
  },

  events: {
    inserted () {
      const vm = this.viewModel
      $('#viewer-app').on('swiperight', function () {
        if (vm.attr('canNavigateBack')) {
          vm.navigateBack()
        }
      })

      $('#viewer-app').on('swipeleft', function () {
        if (vm.attr('canNavigateForward')) {
          vm.navigateForward()
        }
      })
    }
  }
})

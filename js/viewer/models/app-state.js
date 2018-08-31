import CanList from 'can-list'
import route from 'can-route'
import _findIndex from 'lodash/findIndex'
import _isEqual from 'lodash/isEqual'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'

import 'can-map-define'

export const ViewerAppState = DefineMap.extend('ViewerAppState', {
  selectedPageIndex: {
    type: 'string',
    get (lastSet) {
      return lastSet || '0'
    }
  },

  selectedPageName: { // TODO: redundant?
    type: 'string',
    get () {
      if (this.visitedPages.length) {
        return this.visitedPages[this.selectedPageIndex].name
      }
    }
  },

  // current interview page name and text plus it's loopVarValues
  currentVisitedPage: {
    get () {
      const currentPageName = this.page
      console.log('updating to ' + currentPageName)

      if (currentPageName) {
        const currentPage = this.interview.getPageByName(currentPageName)
        if (currentPage) {
          return new DefineMap({
            name: currentPage.attr('name'),
            text: currentPage.attr('text'),
            repeatVar: currentPage.attr('repeatVar'),
            outerLoopVar: currentPage.attr('outerLoopVar'),
            repeatVarValue: this.repeatVarValue,
            outerLoopVarValue: this.outerLoopVarValue
          })
        }
      }
    }
  },

  repeatVarValue: {},
  outerLoopVarValue: {},

  // TODO: change this to currentPageName (fix viewer routes)
  // page (currentPage?) should be reserved for the Map holding all page info
  page: {
    set (val) {
      const currentPage = this.interview.getPageByName(val)
      const repeatVar = currentPage && currentPage.attr('repeatVar')
      const outerLoopVar = currentPage && currentPage.attr('outerLoopVar')
      if (repeatVar) {
        this.repeatVarValue = this.logic.varGet(repeatVar)
      }
      if (outerLoopVar) {
        this.outerLoopVarValue = this.logic.varGet(outerLoopVar)
      }
      return val
    }
  },

  visitedPages: {
    // default () { return new DefineList([]) },
    value ({lastSet, resolve, listenTo}) {
      let currentList = new DefineList([])
      resolve(currentList)

      listenTo('currentVisitedPage', function (ev, visitedPage) {
        if (this.getVisitedPageIndex(visitedPage) === -1) {
          currentList.unshift(visitedPage)
        } else {
          this.restoreLoopVarValues(visitedPage)
        }
        resolve(currentList)
      })
    }
  },

  forceNavigation: {
    type: 'boolean',
    default: false,
    serialize: false
  },

  singlePageLoop: {
    type: 'boolean',
    default: false,
    serialize: false
  },

  previewActive: {
    type: 'boolean',
    serialize: false,
    get () {
      return route.data.attr('page') === 'preview'
    }
  },

  saveAndExitActive: {
    default: false,
    serialize: false
  },

  lastPageBeforeExit: {
    default: null,
    serialize: false
  },

  lastVisitedPageName: {
    default: false,
    serialize: false
  },

  interview: {
    serialize: false,
    set (interview) {
      return interview
    }
  },

  // used for internal page routing in preview
  view: {},

  // TODO: probably can be derived from or replaced by repeatVarValue
  answerIndex: {
    serialize: false,
    default: 1
  },

  // repeatVarValue: {
  //   type: 'number',
  //   get () {
  //     // needs to return the stored repeatVarValue
  //     const newPage = this.interview.getPageByName(this.page)
  //     const repeatVar = newPage && newPage.repeatVar
  //     // current stateful value of repeatVar
  //     return repeatVar && this.logic.get(repeatVar)
  //     // return VisitedPages[currentPage].repeatVarValue
  //   }
  // },

  // outerLoopVarValue: {
  //   type: 'number'
  // },

  logic: {
    serialize: false
  },

  traceLogic: {
    serialize: false,
    default: function () {
      return new CanList()
    }
  },

  init () {
    var self = this

    $(window).on('traceLogic', function (ev, msg) {
      self.attr('traceLogic').push(msg)
    })
  },

  getVisitedPageIndex (visitedPage) {
    return _findIndex(this.visitedPages, function (page) {
      return visitedPage.name === page.name &&
      visitedPage.repeatVarValue === page.repeatVarValue &&
      visitedPage.outerLoopValue === page.outerLoopVarValue
    })
  },

  createVisitedPage (newPageName) {
    const newPage = this.interview.getPageByName(newPageName)
    const repeatVar = newPage.attr('repeatVar')
    const repeatVarValue = (repeatVar) ? this.logic.varGet(repeatVar) : undefined
    const outerLoopVar = newPage.attr('outerLoopVar')
    const outerLoopVarValue = (outerLoopVar) ? this.logic.varGet(outerLoopVar) : undefined

    return {
      name: newPage.attr('name'),
      text: newPage.attr('text'),
      repeatVar,
      repeatVarValue,
      outerLoopVar,
      outerLoopVarValue
    }
  },

  handleRevisitedPage () {

  },

  /**
   * @property {Function} viewerNavigation.ViewModel.restoreLoopVars restoreLoopVars
   * @parent viewerNavigation.ViewModel
   *
   * Restores repeatVar and outerLoopVar values to match the selected page
   */
  restoreLoopVarValues (visitedPage) {
    this.repeatVarValue = visitedPage.attr('repeatVarValue')
    this.outerLoopVarValue = visitedPage.attr('outerLoopVarValue')
  },

  fireCodeBefore (page, logic) {
    let preGotoPage = logic.attr('gotoPage')

    if (page && !this.forceNavigation && page.attr('codeBefore')) {
      this.traceLogic.push({
        page: page.attr('name')
      })
      this.traceLogic.push({
        codeBefore: { format: 'info', msg: 'Logic Before Question' }
      })
      logic.exec(page.attr('codeBefore'))
    }

    let postGotoPage = logic.attr('gotoPage')

    // if gotoPage changes, codeBefore fired a goto event
    return preGotoPage !== postGotoPage ? postGotoPage : false
  }
})

export default ViewerAppState

import CanList from 'can-list'
import route from 'can-route'
import _findIndex from 'lodash/findIndex'
import _assign from 'lodash/assign'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import canDomEvents from 'can-dom-events'
import canReflect from 'can-reflect'

import 'can-map-define'
// import { runInThisContext } from 'vm';

export const ViewerAppState = DefineMap.extend('ViewerAppState', {
  selectedPageIndex: {
    type: 'string',
    get (lastSet) {
      return lastSet || '0'
    }
  },

  selectedPageName: {
    type: 'string',
    get () {
      if (this.visitedPages.length) {
        return this.visitedPages[this.selectedPageIndex].name
      }
    }
  },

  // visitedPage is the currentPage map plus repeatVarValue & outerLoopVarValue
  visitedPage: {
    value ({lastSet, listenTo, resolve}) {
      const visitedPageHandler = function () {
        const loopVarState = {
          repeatVarValue: this.repeatVarValue,
          outerLoopVarValue: this.outerLoopVarValue
        }

        const newVisitedPage = _assign(loopVarState, this.currentPage.serialize())
        const selectedPageIndex = this.getVisitedPageIndex(newVisitedPage)

        // only resolve if visitedPage does not already exist
        if(selectedPageIndex === -1) {
          this.visitedPages.unshift(newVisitedPage)
          resolve(newVisitedPage)
        }
      }

      // changes to any of these 3 values requires checking for a newly visitedPage
      listenTo('currentPage', visitedPageHandler)

      listenTo('repeatVarValue', visitedPageHandler)

      listenTo('outerloopVarValue', visitedPageHandler)

    }
  },

  // CanMap based on current page name (this.page)
  currentPage: {
    get () {
      return this.interview && this.interview.getPageByName(this.page)
    }
  },

  // TODO: change this to currentPageName (fix viewer app.js routes)
  // to match currentPage which is the Map holding all page info
  page: {
    type: 'string',
    value ({ lastSet, listenTo, resolve }) {
      // this.page = foo
      listenTo(lastSet, (pageName) => {
        this.dispatch('pageSet')
        resolve(pageName)
      })
      // page set by drop down navigation
      listenTo('selectedPageName', (ev, selectedPageName) => {
        resolve(selectedPageName)
      })
    }
  },

  repeatVarValue: {
    value ({ lastSet, listenTo, resolve }) {
      // page explicitly set, check for current repeatVarValue
      listenTo('pageSet', (ev) => {
        const repeatVar = this.currentPage && this.currentPage.repeatVar
        const repeatVarValue = repeatVar && this.logic.varGet(repeatVar)
        resolve(this.logic.varGet(repeatVar))
      })
      // restoring from a previously visitedPage
      listenTo('selectedPageIndex', (ev, selectedPageIndex) => {
        const selectedPage = this.visitedPages[selectedPageIndex]
        resolve(selectedPage.repeatVarValue)
      })
    }
  },

  outerLoopVarValue: {
    // mirrors repeatVarValue
  },

  visitedPages: {
    default () { return new DefineList([]) }
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
      return canReflect.getKeyValue(route.data, 'page') === 'preview'
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
    serialize: false
  },

  // used for internal page routing in preview
  view: {},

  // TODO: probably can be derived from or replaced by repeatVarValue
  answerIndex: {
    serialize: false,
    default: 1
  },

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
    // bind to capture first page of invterview
    // stopListenTo fired in preview.js and start-app.js
    var firstPageHandler = function () {}
    this.listenTo('visitedPage', firstPageHandler)

    var self = this

    canDomEvents.addEventListener(window, 'traceLogic', function (ev, msg) {
      self.traceLogic.push(msg)
    })
  },

  getVisitedPageIndex (visitedPage) {
    return _findIndex(this.visitedPages, function (page) {
      return visitedPage.name === page.name &&
      visitedPage.repeatVarValue === page.repeatVarValue &&
      visitedPage.outerLoopValue === page.outerLoopVarValue
    })
  },

  updateLoopVars (pageName) {
    const page = this.interview && this.interview.getPageByName(pageName)
    this.repeatVarValue = page.repeatVar && this.logic.varGet(page.repeatVar)
    this.outerLoopVarValue = page.outerLoopVar && this.logic.varGet(page.outerLoopVar)
  },

  fireCodeBefore (page, logic) {
    let preGotoPage = this.logic.attr('gotoPage')

    if (page && !this.forceNavigation && page.attr('codeBefore')) {
      this.traceLogic.push({
        page: page.attr('name')
      })
      this.traceLogic.push({
        codeBefore: { format: 'info', msg: 'Logic Before Question' }
      })
      logic.exec(page.attr('codeBefore'))
    }

    let postGotoPage = this.logic.attr('gotoPage')

    // if gotoPage changes, codeBefore fired a goto event
    return preGotoPage !== postGotoPage ? postGotoPage : false
  }
})

export default ViewerAppState

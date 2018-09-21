import CanList from 'can-list'
import route from 'can-route'
import _findIndex from 'lodash/findIndex'
import _assign from 'lodash/assign'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import canDomEvents from 'can-dom-events'
import canReflect from 'can-reflect'

import 'can-map-define'

export const ViewerAppState = DefineMap.extend('ViewerAppState', {
  selectedPageIndex: {
    type: 'string',
    get (lastSet) {
      return lastSet || '0'
    }
  },

  // TODO: redundant middleman between this.selectedPageIndex and this.page?
  // solution: bind selectedPageIndex to page in stache properly
  selectedPageName: {
    type: 'string',
    get () {
      if (this.visitedPages.length) {
        return this.visitedPages[this.selectedPageIndex].name
      }
    }
  },

  // current interview page name and text plus it's loopVarValues
  // TODO: should this just be the full page extended with the loopVarValues?
  visitedPage: {
    value ({lastSet, listenTo, resolve}) {
      listenTo('pageChange', (ev, val) => {
        const currentPage = this.interview.getPageByName(this.page)
        // TODO: should this resolve(lastSet) instead?
        if (!currentPage) { return }
        // TODO: handle before logic and goto redirect here
        const newGotoPage = this.fireCodeBefore(currentPage, this.logic)
        if (newGotoPage) {
          this.page = newGotoPage
          return
        }

        const loopVarState = {
          repeatVarValue: currentPage.attr('repeatVar') ? this.logic.varGet(currentPage.attr('repeatVar')) : undefined,
          outerLoopVarValue: currentPage.attr('outerLoopVar') ? this.logic.varGet(currentPage.attr('outerLoopVar')) : undefined
        }

        const newVisitedPage = _assign(loopVarState, currentPage.serialize())

        if (this.getVisitedPageIndex(newVisitedPage) === -1) {
          this.visitedPages.unshift(newVisitedPage)
          if (this.lastVisitedPageName === false || this.lastVisitedPageName !== newVisitedPage.name) {
            this.lastVisitedPageName = newVisitedPage.name
          }
        }
        resolve(newVisitedPage)
      })
    }
  },

  // these are stored at appState level to pass to navigation.stache/js
  // remove somehow?

  repeatVarValue: {},

  outerLoopVarValue: {},

  // TODO: change this to currentPageName (fix viewer app.js routes)
  // page (currentPage or visitedPage?) should be reserved for the Map holding all page info
  // the pageChange dispatched event allows visitedPage to check for new loopVar values, adding visitedPages as needed
  page: {
    type: 'string',
    set () {
      this.dispatch('pageChange')
    }
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

  setLoopVars (pageName) {
    const setPage = this.interview.getPageByName(pageName)
    const repeatVar = setPage.attr('repeatVar')
    this.repeatVarValue = repeatVar && this.logic.varGet(repeatVar)
    const outerLoopVar = setPage.attr('outerLoopVar')
    this.outerLoopVarValue = repeatVar && this.logic.varGet(outerLoopVar)
  },

  getVisitedPageIndex (visitedPage) {
    return _findIndex(this.visitedPages, function (page) {
      return visitedPage.name === page.name &&
      visitedPage.repeatVarValue === page.repeatVarValue &&
      visitedPage.outerLoopValue === page.outerLoopVarValue
    })
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

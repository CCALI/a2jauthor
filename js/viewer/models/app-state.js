import CanList from 'can-list'
import route from 'can-route'
import _findIndex from 'lodash/findIndex'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import canDomEvents from 'can-dom-events'
import canReflect from 'can-reflect'

import 'can-map-define'

export const ViewerAppState = DefineMap.extend('ViewerAppState', {
  selectedPageIndex: {
    type: 'string',
    value ({lastSet, listenTo, resolve}) {
      resolve(0)

      listenTo(lastSet, resolve)
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
    Type: DefineMap
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
        resolve(pageName)
        this.dispatch('pageSet')
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
        if (repeatVar) {
          const repeatVarValue = repeatVar && this.logic.varGet(repeatVar)
          resolve(repeatVarValue)
        } else {
          resolve(null)
        }

        this.dispatch('loopVarUpdate')
      })
      // restoring from a previously visitedPage
      listenTo('selectedPageIndex', (ev, selectedPageIndex) => {
        const selectedPage = this.visitedPages[selectedPageIndex]
        this.logic.varSet(selectedPage.repeatVar, selectedPage.repeatVarValue)
        resolve(selectedPage.repeatVarValue)
      })
    }
  },

  outerLoopVarValue: {
    value ({ lastSet, listenTo, resolve }) {
      // page explicitly set, check for current repeatVarValue
      listenTo('pageSet', (ev) => {
        const outerLoopVar = this.currentPage && this.currentPage.outerLoopVar
        if (outerLoopVar) {
          const outerLoopVarValue = outerLoopVar && this.logic.varGet(outerLoopVar)
          resolve(outerLoopVarValue)
        } else {
          resolve(null)
        }

        this.dispatch('loopVarUpdate')
      })
      // restoring from a previously visitedPage
      listenTo('selectedPageIndex', (ev, selectedPageIndex) => {
        const selectedPage = this.visitedPages[selectedPageIndex]
        this.logic.varSet(selectedPage.outerLoopVar, selectedPage.outerLoopVarValue)
        resolve(selectedPage.outerLoopVarValue)
      })
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
  },

  getVisitedPageIndex (visitedPage) {
    return _findIndex(this.visitedPages, function (page) {
      return visitedPage.name === page.name &&
      visitedPage.repeatVarValue == page.repeatVarValue &&
      visitedPage.outerLoopValue == page.outerLoopVarValue
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
  },

  connectedCallback (el) {
    const visitedPageHandler = () => {
      if (!this.currentPage) { return }

      const newVisitedPage = new DefineMap(this.currentPage)
      newVisitedPage.set('repeatVarValue', this.repeatVarValue)
      newVisitedPage.set('outerLoopVarValue', this.outerLoopVarValue)

      const selectedPageIndex = this.getVisitedPageIndex(newVisitedPage)

      // only resolve if visitedPage does not already exist
      if (selectedPageIndex === -1) {
        const newGotoPage = this.fireCodeBefore(this.currentPage, this.logic)
        // newGotoPage means A2J GOTO logic sets a new page
        // and does not add the current page to the visitedPages list
        if (newGotoPage) {
          this.page = newGotoPage
        } else {
          this.visitedPages.unshift(newVisitedPage)
          this.lastVisitedPageName = newVisitedPage.name
          this.visitedPage = newVisitedPage
        }
      } else {
        this.selectedPageIndex = selectedPageIndex
      }
    }

    // any time one of the loopVars update, check for new visitedPage
    this.listenTo('loopVarUpdate', visitedPageHandler)

    // TODO: figure out a way to do this without these bindings
    this.listenTo('page', () => {})
    this.listenTo('repeatVarValue', () => {})
    this.listenTo('outerLoopVarValue', () => {})

    // this.listenTo(this.traceLogic, 'length', ()=>{ debugger })
    this.listenTo(window, 'traceLogic', (ev) => {
      this.traceLogic.push(ev.data)
    })

    return () => { this.stopListening() }
  }
})

export default ViewerAppState

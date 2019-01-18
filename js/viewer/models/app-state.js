import CanList from 'can-list'
import route from 'can-route'
import _findIndex from 'lodash/findIndex'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import canReflect from 'can-reflect'

import 'can-map-define'

export const ViewerAppState = DefineMap.extend('ViewerAppState', {
  selectedPageIndex: {
    serialize: false,
    type: 'string',
    value ({ lastSet, listenTo, resolve }) {
      resolve(0)

      listenTo(lastSet, (index) => {
        const revisitedPage = this.visitedPages[index]
        this.restoreLoopVars(revisitedPage)
        resolve(index)
      })
    }
  },

  selectedPageName: {
    serialize: false,
    type: 'string',
    get () {
      if (this.visitedPages.length) {
        return this.visitedPages[this.selectedPageIndex].name
      }
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

  // CanMap based on current page name (this.page)
  currentPage: {
    serialize: false,
    get () {
      return this.interview && this.interview.getPageByName(this.page)
    }
  },

  repeatVarValue: {
    type: 'number'
  },

  outerLoopVarValue: {
    type: 'number'
  },

  visitedPages: {
    serialize: false,
    default () { return new DefineList([]) }
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
    serialize: false,
    set (interview) {
      document.title = 'A2J Guided Interview called ' + interview.title
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

  logic: {
    serialize: false
  },

  traceLogic: {
    serialize: false,
    default: function () {
      return new CanList()
    }
  },

  getVisitedPageIndex (visitedPage) {
    return _findIndex(this.visitedPages, function (page) {
      return visitedPage.name === page.name &&
      visitedPage.repeatVarValue == page.repeatVarValue && // eslint-disable-line
      visitedPage.outerLoopValue == page.outerLoopVarValue // eslint-disable-line
    })
  },

  restoreLoopVars (visitedPage) {
    const repeatVar = visitedPage.repeatVar
    if (repeatVar) {
      this.logic.varSet(repeatVar, visitedPage.repeatVarValue)
      this.repeatVarValue = visitedPage.repeatVarValue
    }
    const outerLoopVar = visitedPage.outerLoopVar
    if (outerLoopVar) {
      this.logic.varSet(outerLoopVar, visitedPage.outerLoopVarValue)
      this.outerLoopVarValue = visitedPage.outerLoopVarValue
    }
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

    // if gotoPage changes, codeBefore fired a A2J GOTO logic
    return preGotoPage !== postGotoPage ? postGotoPage : false
  },

  checkInfiniteLoop () {
    if (this.logic.attr('infinite.outOfRange')) {
      this.traceLogic.push({
        'infinite loop': {
          format: 'info',
          msg: 'Possible infinite loop. Too many page jumps without user interaction'
        }
      })
      this.page = '__error'
    } else {
      this.logic.attr('infinite').inc()
    }
  },

  connectedCallback () {
    const visitedPageHandler = (ev) => {
      if (!this.currentPage) { return }
      this.checkInfiniteLoop()

      const newGotoPage = this.fireCodeBefore(this.currentPage, this.logic)
      if (newGotoPage) {
        this.page = newGotoPage
        return
      }

      const repeatVar = this.currentPage.repeatVar
      const outerLoopVar = this.currentPage.outerLoopVar
      const repeatVarValue = repeatVar ? this.logic.varGet(repeatVar) : undefined
      const outerLoopVarValue = outerLoopVar ? this.logic.varGet(outerLoopVar) : undefined

      const newVisitedPage = new DefineMap(this.currentPage)
      newVisitedPage.set('repeatVarValue', repeatVarValue)
      newVisitedPage.set('outerLoopVarValue', outerLoopVarValue)
      const revisitedPageIndex = this.getVisitedPageIndex(newVisitedPage)

      if (revisitedPageIndex === -1) {
        this.repeatVarValue = repeatVarValue
        this.outerLoopVarValue = outerLoopVarValue
        this.visitedPages.unshift(newVisitedPage)
        this.lastVisitedPageName = newVisitedPage.name
      } else {
        this.selectedPageIndex = revisitedPageIndex
      }
    }

    // any time one of the loopVars update, check for new visitedPage
    this.listenTo('pageSet', visitedPageHandler)

    // TODO: figure out a way to do this without these bindings
    this.listenTo('page', () => {})

    // this.listenTo(this.traceLogic, 'length', ()=>{ debugger })
    this.listenTo(window, 'traceLogic', (ev) => {
      this.traceLogic.push(ev.data)
    })

    return () => { this.stopListening() }
  }
})

export default ViewerAppState

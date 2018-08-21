import CanMap from 'can-map'
import CanList from 'can-list'
import route from 'can-route'
import _findIndex from 'lodash/findIndex'
import makeCompat from 'can-map-compat'
import DefineMap from 'can-define/map/map'

import 'can-map-define'

export const ViewerAppState = makeCompat(DefineMap.extend('ViewerAppState', {
  visitedPages: {
    Default: CanList,
    serialize: false
  },

  selectedPageIndex: {
    type: 'string',
    get (lastSet) {
      return lastSet || '0'
    }
  },

  selectedPageName: {
    value ({lastSet, resolve, listenTo}) {
      listenTo('selectedPageIndex', (ev, newVal) => {
        const selectedPage = this.visitedPages[lastSet]
        this.restoreLoopVars(selectedPage)
        resolve(selectedPage.name)
      })
    }
  },

  page: {
    value ({lastSet, resolve, listenTo}) {
      let curVal = ''

      listenTo('selectedPageName', (newVal) => {
        if (newVal !== curVal) {
          resolve(newVal)
        }
      })

      listenTo(lastSet, (newVal) => {
        curVal = newVal
        resolve(newVal)
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

  repeatVarValue: {
    type: 'number'
  },

  outerLoopVarValue: {
    type: 'number'
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
    var self = this

    $(window).on('traceLogic', function (ev, msg) {
      self.attr('traceLogic').push(msg)
    })
  },

  /**
   * @property {Function} viewerNavigation.ViewModel.restoreLoopVars restoreLoopVars
   * @parent viewerNavigation.ViewModel
   *
   * Restores repeatVar and outerLoopVar values to match the selected page
   */
  restoreLoopVars (selectedPage) {
    const appState = this.attr('appState')

    const repeatVar = selectedPage.attr('repeatVar')
    const repeatVarValue = selectedPage.attr('repeatVarValue')
    const outerLoopVar = selectedPage.attr('outerLoopVar')
    const outerLoopVarValue = selectedPage.attr('outerLoopVarValue')

    if (repeatVar && repeatVarValue) {
      appState.attr('repeatVarValue', repeatVarValue)
      this.attr('logic').varSet(repeatVar, repeatVarValue)
    }

    if (outerLoopVar && outerLoopVarValue) {
      appState.attr('outerLoopVarValue', outerLoopVarValue)
      this.attr('logic').varSet(outerLoopVar, outerLoopVarValue)
    }
  },

  setVisitedPages (pageName, interview) {
    if (!pageName || !interview) return

    let visited = this.attr('visitedPages')
    let page = interview.getPageByName(pageName)

    let logic = this.attr('logic')
    let repeatVar = page && page.attr('repeatVar')
    let repeatVarValue = (repeatVar) ? logic.varGet(repeatVar) : undefined
    let outerLoopVar = page && page.attr('outerLoopVar')
    let outerLoopVarValue = (outerLoopVar) ? logic.varGet(outerLoopVar) : undefined

    let lastVisitedPageName = this.attr('lastVisitedPageName')

    if (lastVisitedPageName === false || lastVisitedPageName !== pageName) {
      this.attr('lastVisitedPageName', pageName)
    }

    // do not add the same page twice.
    const alreadyVisitedIndex = _findIndex(visited, function (visitedPage) {
      let visitedPageRepeatVarValue = visitedPage.attr('repeatVarValue')
      return visitedPage.attr('name') === pageName &&
             (!visitedPageRepeatVarValue || (visitedPageRepeatVarValue === repeatVarValue))
    })
    const alreadyVisited = alreadyVisitedIndex > -1

    // if there is any codeBefore that we need to execute, let's do that.
    // this will make sure that any macros inside the page.attr('text') gets evaluated properly.
    let newGotoPage
    if (page && page.attr('codeBefore') && (lastVisitedPageName !== pageName || this.attr('singlePageLoop'))) {
      newGotoPage = this.fireCodeBefore(page, logic)
    }
    // newGotoPage means a GOTO event fired in the codeBefore skip this current pageName
    // as visited, and set the newGotoPage instead
    if (newGotoPage) {
      this.setVisitedPages(newGotoPage, interview)
    }

    if (page && !alreadyVisited && !newGotoPage) {
      let text = (logic && logic.eval) ? logic.eval(page.attr('text')) : page.attr('text')
      let name = page.attr('name')
      visited.unshift({ name, text, repeatVar, repeatVarValue, outerLoopVar, outerLoopVarValue })
    }

    if (page && alreadyVisited) {
      visited.dispatch(['revisited', alreadyVisitedIndex])
    }
  },

  fireCodeBefore (page, logic) {
    let forceNavigation = this.attr('forceNavigation')
    let traceLogic = this.attr('traceLogic')
    let preGotoPage = logic.attr('gotoPage')

    if (page && !forceNavigation && page.attr('codeBefore')) {
      traceLogic.push({
        page: page.attr('name')
      })
      traceLogic.push({
        codeBefore: { format: 'info', msg: 'Logic Before Question' }
      })
      logic.exec(page.attr('codeBefore'))
    }

    let postGotoPage = logic.attr('gotoPage')

    // if gotoPage changes, codeBefore fired a goto event
    return preGotoPage !== postGotoPage ? postGotoPage : false
  }
}))

export default ViewerAppState

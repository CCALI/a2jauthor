import Map from 'can/map/';
import List from 'can/list/';
import _find from 'lodash/find';

import 'can/map/define/';

export const ViewerAppState = Map.extend({
  define: {

    visitedPages: {
      Value: List,
      serialize: false
    },

    forceNavigation: {
      type: 'boolean',
      value: false,
      serialize: false
    },

    singlePageLoop: {
      type: 'boolean',
      value: false,
      serialize: false
    },

    previewActive: {
      type: 'boolean',
      serialize: false,
      get() {
        return can.route.attr('page') === 'preview';
      }
    },

    saveAndExitActive: {
      value: false,
      serialize: false
    },

    lastPageBeforeExit: {
      value: null,
      serialize: false
    },

    lastVisitedPageName: {
      value: false,
      serialize: false
    },

    interview: {
      serialize: false,
      set(interview) {
        // let pageName = this.attr('page');
        // this.setVisitedPages(pageName, interview);
        return interview;
      }
    },

    page: {
      value: '',
      set(pageName) {
        let interview = this.attr('interview');
        this.setVisitedPages(pageName, interview);
        return pageName;
      }
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
      value: function() {
        return new List();
      }
    }

  },

  init() {


    var self = this;

    $(window).on('traceLogic', function(ev, msg) {
      self.attr('traceLogic').push(msg);
    });
  },

  setVisitedPages(pageName, interview) {

    if (!pageName || !interview) return;

    let visited = this.attr('visitedPages');
    let page = interview.getPageByName(pageName);

    let logic = this.attr('logic');
    let repeatVar = page && page.attr('repeatVar');
    let repeatVarValue = (repeatVar) ? logic.varGet(repeatVar) : undefined;
    let outerLoopVar = page && page.attr('outerLoopVar');
    let outerLoopVarValue = (outerLoopVar) ? logic.varGet(outerLoopVar) : undefined;

    let lastVisitedPageName = this.attr("lastVisitedPageName");

    if (lastVisitedPageName === false || lastVisitedPageName !== pageName) {
       this.attr('lastVisitedPageName', pageName);
    }

    // do not add the same page twice.
    let alreadyVisited = _find(visited, function(visitedPage) {
      let visitedPageRepeatVarValue = visitedPage.attr('repeatVarValue');
      return visitedPage.attr('name') === pageName &&
             (!visitedPageRepeatVarValue || (visitedPageRepeatVarValue === repeatVarValue));
    });

    //if there is any codeBefore that we need to execute, let's do that.
    //this will make sure that any macros inside the page.attr('text') get's evaluated properly.
    let newGotoPage;
    if (page && page.attr('codeBefore') && (lastVisitedPageName !== pageName || this.attr('singlePageLoop'))) {
      newGotoPage = this.fireCodeBefore(page, logic);
    }
    // newGotoPage means a GOTO event fired in the codeBefore skip this current pageName
    // as visited, and set the newGotoPage instead
    if (newGotoPage) {
      this.setVisitedPages(newGotoPage, interview);
    }
    // newGoto pages don't populate the visitedPages list
    if (page && !alreadyVisited && !newGotoPage) {
      let text = (logic && logic.eval) ? logic.eval(page.attr('text')) : page.attr('text');
      let name = page.attr('name');
      visited.unshift({ name, text, repeatVar, repeatVarValue, outerLoopVar, outerLoopVarValue });
    }
  },

  fireCodeBefore(page, logic) {
    let forceNavigation = this.attr('forceNavigation');
    let traceLogic = this.attr('traceLogic');
    let preGotoPage = logic.attr('gotoPage');

    if (page && !forceNavigation && page.attr('codeBefore')) {
        traceLogic.push({
          page: page.attr("name")
        });
        traceLogic.push({
          codeBefore: { format: 'info', msg: 'Logic Before Question'}
        });
      logic.exec(page.attr('codeBefore'));
    }

    let postGotoPage = logic.attr('gotoPage');

    // if gotoPage changes, codeBefore fired a goto event
    return preGotoPage !== postGotoPage ? postGotoPage : false;
  }
});

export default ViewerAppState;
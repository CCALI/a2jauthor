import Map from 'can/map/';
import List from 'can/list/';
import _find from 'lodash/find';

import 'can/map/define/';

export default Map.extend({
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

    interview: {
      serialize: false,
      set(interview) {
        let pageName = this.attr('page');
        debugger
        this.setVisitedPages(pageName, interview);
        return interview;
      }
    },

    page: {
      value: '',
      set(pageName) {
        let interview = this.attr('interview');
        debugger
        this.setVisitedPages(pageName, interview);
        return pageName;
      }
    },

    repeatVarValue: {
      type: 'number'
    },

    logic: {
      serialize: false
    }
  },

  setVisitedPages(pageName, interview) {
    if (!pageName || !interview) return;

    let visited = this.attr('visitedPages');
    let page = interview.getPageByName(pageName);

    let logic = this.attr('logic');
    let repeatVar = page && page.attr('repeatVar');
    let repeatVarValue = (repeatVar) ? logic.varGet(repeatVar) : undefined;

    // do not add the same page twice.
    let alreadyVisited = _find(visited, function(visitedPage) {
      let visitedPageRepeatVarValue = visitedPage.attr('repeatVarValue');
      return visitedPage.attr('name') === pageName &&
             (!visitedPageRepeatVarValue || (visitedPageRepeatVarValue === repeatVarValue));
    });

    //if there is any codeBefore that we need to execute, let's do that.
    //this will make sure that any macros inside the page.attr('text') get's evaluated properly.

    if (page && this.attr("forceNavigation") === false && page.attr('codeBefore')) {
      debugger
      logic.exec(page.attr('codeBefore'));
    }

    if (page && !alreadyVisited) {
      let text = (logic && logic.eval) ? logic.eval(page.attr('text')) : page.attr('text');
      let name = page.attr('name');
      visited.unshift({ name, text, repeatVar, repeatVarValue });
    }
  }
});

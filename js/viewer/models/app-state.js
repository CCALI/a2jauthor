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

    saveAndExitActive: {
      value: false,
      serialize: false
    },

    activePageBeforeExit: {
      value: null,
      serialize: false
    },

    interview: {
      serialize: false,
      set(interview) {
        let pageName = this.attr('page');
        this.setVisitedPages(pageName, interview);
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

    if (page && !alreadyVisited) {
      let text = (logic && logic.eval) ? logic.eval(page.attr('text')) : page.attr('text');
      let name = page.attr('name');
      visited.unshift({ name, text, repeatVar, repeatVarValue });
    }
  }
})

import Map from 'can/map/';
import List from 'can/list/';
import _find from 'lodash/collection/find';

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
    }
  },

  setVisitedPages(pageName, interview) {
    if (!pageName || !interview) return;

    let visited = this.attr('visitedPages');
    let page = interview.getPageByName(pageName);

    // do not add the same page twice.
    let alreadyVisited = _find(visited, function(visitedPage) {
      return visitedPage.attr('name') === pageName;
    });

    if (page && !alreadyVisited) visited.unshift(page);
  }
})

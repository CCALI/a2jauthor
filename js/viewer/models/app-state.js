import Map from 'can/map/';
import List from 'can/list/';
import _find from 'lodash/collection/find';

import 'can/map/define/';

export default Map.extend({
  define: {
    interview: {
      serialize: false
    },

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

    page: {
      value: '',

      set(pageName) {
        this.setVisitedPages(pageName);
        return pageName;
      }
    }
  },

  setVisitedPages(pageName) {
    let interview = this.attr('interview');
    let visited = this.attr('visitedPages');

    if (!pageName || !interview) return;

    let page = interview.getPageByName(pageName);

    // do not add the same page twice.
    let alreadyVisited = _find(visited, function(visitedPage) {
      return visitedPage.attr('name') === pageName;
    });

    if (page && !alreadyVisited) visited.unshift(page);
  }
})

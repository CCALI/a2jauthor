import Map from 'can/map/';
import List from 'can/list/';

import 'can/map/define/';

export default Map.extend({
  define: {
    page: {
      value: ''
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
    }
  }
})

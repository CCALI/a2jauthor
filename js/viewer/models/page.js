import Map from 'can/map/';
import List from 'can/list/';
import Field from 'viewer/models/field';
import Answer from 'viewer/models/answer';
import _find from 'lodash/collection/find';

import 'can/map/define/';

let Page = Map.extend({
  define: {
    step: {
      // forces the convertion of TStep objects when converting
      // `window.gGuide` to an Interview model instance.
      Type: Map
    },

    fields: {
      set: function(list) {
        list.forEach(f => f.page = this);
        let fields = new Field.List(list);
        return fields;
      },

      Type: Field.List
    }
  }
});

Page.List = List.extend({
  Map: Page
}, {
  find: function(name) {
    return _find(this, function(page) {
      return page.attr('name') === name;
    });
  }
});

export default Page;

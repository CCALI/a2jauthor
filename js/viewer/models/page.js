import Map from 'can/map/';
import List from 'can/list/';
import Field from 'viewer/models/field';
import Answer from 'viewer/models/answer';
import _find from 'lodash/collection/find';

import 'can/map/define/';

const userGenderVarName = 'user gender';

let Page = Map.extend({
  define: {
    step: {
      // forces the convertion of TStep objects when converting
      // `window.gGuide` to an Interview model instance.
      Type: Map
    },

    fields: {
      set(list) {
        list.forEach(f => f.page = this);
        let fields = new Field.List(list);
        return fields;
      },

      Type: Field.List
    },

    // whether this page has an 'user gender' field.
    hasUserGenderField: {
      serialize: false,

      get() {
        let fields = this.attr('fields');

        return !!_find(fields, function(field) {
          let fieldName = field.attr('name').toLowerCase();
          return fieldName === userGenderVarName;
        });
      }
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

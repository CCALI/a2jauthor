import Map from 'can/map/';
import List from 'can/list/';
import _find from 'lodash/find';
import Field from 'caja/viewer/models/field';

import 'can/map/define/';

const userGenderVarName = 'user gender';

const Page = Map.extend({
  define: {
    step: {
      // forces the convertion of TStep objects when converting
      // `window.gGuide` to an Interview model instance.
      Type: Map
    },

    fields: {
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
  find(name) {
    return _find(this, p => p.attr('name') === name);
  }
});

export default Page;

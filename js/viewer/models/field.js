import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Answer from 'viewer/models/answer';
import normalizePath from 'caja/viewer/util/normalize-path';

import 'can/map/define/';

/**
 * @module {can.Map} Field
 * @parent api-models
 *
 * A map representing a field of an interview page
 */
const Field = Map.extend({
  define: {
    options: {
      value: ''
    },

    emptyAnswer: {
      get() {
        return new Answer({
          values: [null],
          type: this.attr('type'),
          repeating: this.attr('repeating'),
          name: this.attr('name').toLowerCase()
        });
      }
    }
  },

  /**
   * @function getOptions
   * @return {jQuery.Deferred} A deferred object that resolves to a list
   *
   * List of options of a given field (e.g select box options)
   *
   * Some fields, like a select box, require a list of options for the
   * user to pick. The options might be already available in the listData
   * property or if listSrc is defined, an ajax request should be triggered to
   * get the options from a different endpoint or an XML stored in the guide
   * folder
   */
  getOptions(guidePath) {
    let dfd = $.Deferred();
    let listSrc = this.attr('listSrc');
    let listData = this.attr('listData');

    if (!listData && !listSrc) {
      return dfd.reject(new Error('Missing listData or listSrc values'));
    }

    if (listData) {
      this.attr('options', listData);
      return dfd.resolve(listData);
    }

    if (listSrc) {
      let ajaxOptions = {
        dataType: 'text',
        url: normalizePath(guidePath, listSrc)
      };

      $.ajax(ajaxOptions)
        .then(options => {
          // strip anything before or after option tags
          let formatted = options.replace(/<select>/ig, '').replace(/<\/select/ig, '');
          this.attr('options', formatted);
          dfd.resolve(formatted);
        })
        .then(null, function(error) {
          dfd.reject(error);
        });
    }

    return dfd;
  }
});

Field.List = List.extend({
  Map: Field
}, {});

export default Field;

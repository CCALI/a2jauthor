import moment from 'moment';
import Model from 'can/model/';
import comparator from 'author/utils/sort-comparator';

import 'can/map/define/';

export const lastModifiedFormat = 'YYYY-M-D H:m:s';

let Template = Model.extend({
  findAll: 'GET /templates',

  parseModels(data) {
    return data.sort((a, b) => a.buildOrder - b.buildOrder);
  }
}, {
  define: {
    lastModified: {
      get(lastVal) {
        return moment(lastVal, lastModifiedFormat);
      }
    },

    lastModifiedFromNow: {
      get() {
        let lastModified = this.attr('lastModified');
        return lastModified.isValid() ? lastModified.fromNow() : '';
      }
    }
  }
});

Template.List = Template.List.extend({
  sortBy: function(key, direction='asc') {
    switch (key) {
      case 'buildOrder':
        this.attr('comparator', comparator.number(key, direction));
        break;

      case 'title':
        this.attr('comparator', comparator.string(key, direction));
        break;

      case 'lastModified':
        this.attr('comparator', comparator.moment(key, direction));
        break;
    }
  }
});

/**
 * @module {function} Template
 * @inherits can.Model
 *
 * The **Template** model represents a template to be used to assemble a document
 * from an interview.
 *
 * @codestart
 *   Template.findAll({}).then(function(templates) {
 *   });
 * @codeend
 */
export default Template;

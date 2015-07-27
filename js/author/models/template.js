import moment from 'moment';
import Model from 'can/model/';
import comparator from './template-comparator';

import 'can/map/define/';

export const lastModifiedFormat = 'YYYY-M-D H:m:s';

let Template = Model.extend({
  findAll: 'GET /templates'
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
  active() {
    return this.filter(template => template.attr('active'));
  },

  deleted() {
    return this.filter(template => !template.attr('active'));
  },

  // overriding filter due to a bug in the base implementation
  filter(predicate) {
    let filtered = new this.constructor();

    this.each((item, index) => {
      if (predicate.call(this, item, index, this)) {
        filtered.push(item);
      }
    });

    return filtered;
  },

  sortBy(key, direction = 'asc') {
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
  },

  search(token) {
    return this.filter(function(template) {
      token = token.toLowerCase();
      let title = template.attr('title').toLowerCase();
      return title.indexOf(token) !== -1;
    });
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

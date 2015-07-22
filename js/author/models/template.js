import moment from 'moment';
import Model from 'can/model/';

import 'can/map/define/';

export const lastModifiedFormat = 'YYYY-M-D H:m:s';

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
export default Model.extend({
  findAll: 'GET /templates'
}, {
  define: {
    lastModifiedFromNow: {
      get() {
        let lastModified = moment(this.attr('lastModified'), lastModifiedFormat);
        return lastModified.isValid() ? lastModified.fromNow() : '';
      }
    }
  }
});

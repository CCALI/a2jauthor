import Model from 'can/model/';

import 'can/map/define/';

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
  define: {}
});

import Model from 'can/model/';
import AJ2Node from './aj2-node';
import 'can/map/define/';

/**
 * @module AJ2Template
 * @parent api-models
 *
 * An AJ2 Template Model represents the structure of a legal document that
 * can be rendered with variables collected during a guided interview.
 *
 * It is made up of [AJ2Node]s which are made up of authoring components.
 *
 * A guided interview can have one or more AJ2 Templates associated to it.
 */
export default Model.extend({
  findAll: '/api/guides/{guide_id}/templates',
  findOne: '/api/templates/{template_id}',

  /**
   * @function makeDocumentTree
   *
   * Take a rootNode and traverse the tree while making every node an
   * [AJ2Node].
   *
   * @param {can.Map} node
   */
  makeDocumentTree: function(node) {
    let scope = this;
    let branch = new AJ2Node(node);

    if(branch.attr('children.length')) {
      branch.attr('children').forEach(function(child, index) {
        branch.attr('children.' + index, scope.makeDocumentTree(child));
      });
    }

    return branch;
  },

  makeFindOne: function(findOneData) {
    return function(params, success, error) {
      return findOneData(params).then((response) => {
        let aj2Template = this.model(response);
        let documentTree = this.makeDocumentTree(
          aj2Template.attr('rootNode'));

        aj2Template.attr('rootNode', documentTree);

        return aj2Template;
      })
      .then(success, error);
    };
  }
}, {
  define: {
    rootNode : {
      value: function() {
        return new AJ2Node({
          type: 'aj2-template'
        });
      }
    }
  }
});

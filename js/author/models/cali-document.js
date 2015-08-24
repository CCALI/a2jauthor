import Model from 'can/model/';
import CaliNode from './cali-node';
import 'can/map/define/';

/**
 * @module CaliDocument
 * @parent api-models
 *
 * A CaliDocument Model represents the structure of a legal document that
 * can be rendered with variables collected during a guided interview.
 *
 * It is made up of [CaliNode]s which are made up of authoring components.
 */
export default Model.extend({
  findOne: '/api/documents/{id}',

  /**
   * @function makeDocumentTree
   *
   * Take a rootNode and traverse the tree while making every node a [CaliNode].
   *
   * @param {can.Map} node
   */
  makeDocumentTree: function(node) {
    let scope = this;
    let branch = new CaliNode(node);

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
        let caliDocument = this.model(response);
        let documentTree = this.makeDocumentTree(
          caliDocument.attr('rootNode'));

        caliDocument.attr('rootNode', documentTree);

        return caliDocument;
      })
      .then(success, error);
    };
  }
}, {
  define: {
    rootNode : {
      value: function() {
        return new CaliNode({
          type: 'cali-document'
        });
      }
    }
  }
});

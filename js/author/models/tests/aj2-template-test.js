import AJ2Template from '../aj2-template';
import AJ2Node from '../aj2-node';
import assert from 'assert';
import 'steal-mocha';

describe('AJ2Template Model', () => {
  it('contains a tree rooted at rootNode made up of AJ2Nodes', () => {
    return AJ2Template.findOne({ id: 2112 }).then((caliDocument) => {
      assert.ok(caliDocument.attr('rootNode') instanceof AJ2Node);
      assert.ok(caliDocument.attr('rootNode.children.0') instanceof AJ2Node);
      assert.ok(caliDocument.attr('rootNode.children.0.children.0') instanceof
        AJ2Node);
      assert.ok(caliDocument.attr('rootNode.children.0.children.1') instanceof
        AJ2Node);
    });
  });
});

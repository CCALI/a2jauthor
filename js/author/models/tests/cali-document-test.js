import CaliDocument from '../cali-document';
import CaliNode from '../cali-node';
import assert from 'assert';
import 'steal-mocha';

describe('CaliDocument Model', () => {
  it('contains a tree rooted at rootNode made up of CaliNodes', () => {
    return CaliDocument.findOne({ id: 2112 }).then((caliDocument) => {
      assert.ok(caliDocument.attr('rootNode') instanceof CaliNode);
      assert.ok(caliDocument.attr('rootNode.children.0') instanceof CaliNode);
      assert.ok(caliDocument.attr('rootNode.children.0.children.0') instanceof
        CaliNode);
      assert.ok(caliDocument.attr('rootNode.children.0.children.1') instanceof
        CaliNode);
    });
  });
});

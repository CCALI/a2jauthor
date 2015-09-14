import A2JTemplate from '../a2j-template';
import A2JNode from '../a2j-node';
import assert from 'assert';
import 'steal-mocha';

describe('A2JTemplate Model', () => {
  it('findOne', () => {
    return A2JTemplate.findOne({ template_id: 2112 }).then((a2jTemplate) => {
      assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode);
      assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode);
      assert.ok(a2jTemplate.attr('rootNode.children.1') instanceof A2JNode);
    });
  });

  it('findAll', () => {
    return A2JTemplate.findAll({ guide_id: 1261 }).then((a2jTemplates) => {
      a2jTemplates.map((a2jTemplate) => {
        assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode);
        assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode);
      });
    });
  });
});

import can from 'can';
import A2JTemplate from '../a2j-template';
import A2JNode from '../a2j-node';
import assert from 'assert';
import 'steal-mocha';

describe('A2JTemplate Model', function() {

  beforeEach(function() {
    localStorage.clear();
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('findOne', function() {
    return A2JTemplate.findOne({ template_id: 2112 }).then((a2jTemplate) => {
      assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode);
      assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode);
      assert.ok(a2jTemplate.attr('rootNode.children.1') instanceof A2JNode);
    });
  });

  it('findAll', function() {
    return A2JTemplate.findAll({ guide_id: 1261 }).then((a2jTemplates) => {
      a2jTemplates.map((a2jTemplate) => {
        assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode);

        if (a2jTemplate.attr('rootNode.children.length')) {
          assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode);
        }
      });
    });
  });

  it('create', function() {
    let a2jTemplate = new A2JTemplate({ title: 'Best Template' });

    return a2jTemplate.save().then((bestTemplate) => {
      assert.equal(bestTemplate.attr('title'), 'Best Template');
    });
  });

  it('update', function(done) {
    let a2jTemplate = new A2JTemplate({ title: 'Best Template' });

    a2jTemplate.save().then((bestTemplate) => {
      assert.equal(bestTemplate.attr('title'), 'Best Template');

      let templateId = bestTemplate.attr('template_id');

      bestTemplate.attr('title', 'Bestest Template');

      bestTemplate.save().then((bestestTemplate) => {
        assert.equal(bestestTemplate.attr('title'), 'Bestest Template');
        assert.equal(bestestTemplate.attr('template_id'), templateId);

        done();
      });
    });
  });

  it('destroy', function(done) {
    A2JTemplate.findAll({ guide_id: 1261 }).then((a2jTemplates) => {
      let destroyPromises = [];

      a2jTemplates.map((a2jTemplate) => {
        if (a2jTemplate.attr('template_id') >= 3000) {
          destroyPromises.push(a2jTemplate.destroy());
        }
      });

      can.when.apply(this, destroyPromises).done(() => { done(); });
    });
  });

  it('addNode', function() {
    let dfd = A2JTemplate.findOne({ template_id: 2112 });

    return dfd.then(function(a2jTemplate) {
      let children = a2jTemplate.attr('rootNode.children');
      let total = children.attr('length');

      a2jTemplate.addNode(null);
      assert.equal(children.attr('length'), total,
        'it does nothing when invalid node is passed');

      let newNode = new A2JNode({title: 'foo bar'});
      a2jTemplate.addNode(newNode);

      assert.equal(children.attr('length'), total + 1, 'there should be one more');
      assert.equal(children.pop().attr('title'), 'foo bar');
    });
  });
});

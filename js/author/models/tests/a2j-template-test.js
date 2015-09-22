import can from 'can';
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

        if(a2jTemplate.attr('rootNode.children.length')) {
          assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode);
        }
      });
    });
  });

  it('create', () => {
    let a2jTemplate = new A2JTemplate({ title: 'Best Template' });

    return a2jTemplate.save().then((bestTemplate) => {
      assert.equal(bestTemplate.attr('title'), 'Best Template');
    });
  });

  it('update', (done) => {
    let a2jTemplate = new A2JTemplate({ title: 'Best Template' });

    a2jTemplate.save().then((bestTemplate) => {
      assert.equal(bestTemplate.attr('title'), 'Best Template');

      let template_id = bestTemplate.attr('template_id');

      bestTemplate.attr('title', 'Bestest Template');

      bestTemplate.save().then((bestestTemplate) => {
        assert.equal(bestestTemplate.attr('title'), 'Bestest Template');
        assert.equal(bestestTemplate.attr('template_id'), template_id);

        done();
      });
    });
  });

  it('destroy', (done) => {
    A2JTemplate.findAll({ guide_id: 1261 }).then((a2jTemplates) => {
      let destroyPromises = []

      a2jTemplates.map((a2jTemplate) => {
        if(a2jTemplate.attr('template_id') >= 3000) {
          destroyPromises.push(a2jTemplate.destroy());
        }
      });

      can.when.apply(this, destroyPromises).done(() => { done(); });
    });
  });
});

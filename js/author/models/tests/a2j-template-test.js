import can from 'can';
import assert from 'assert';
import A2JNode from '../a2j-node';
import A2JTemplate from '../a2j-template';

import 'steal-mocha';

describe('A2JTemplate Model', function() {

  beforeEach(function() {
    localStorage.clear();
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('findOne', function() {
    let promise = A2JTemplate.findOne({templateId: 2112});

    return promise.then(function(a2jTemplate) {
      assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode);
      assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode);
      assert.ok(a2jTemplate.attr('rootNode.children.1') instanceof A2JNode);
    });
  });

  it('findAll', function() {
    let promise = A2JTemplate.findAll({guideId: 1261});

    return promise.then(function(a2jTemplates) {
      a2jTemplates.each(function(a2jTemplate) {
        assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode);

        if (a2jTemplate.attr('rootNode.children.length')) {
          assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode);
        }
      });
    });
  });

  it('create', function() {
    let a2jTemplate = new A2JTemplate({title: 'Best Template'});

    return a2jTemplate.save().then(function(bestTemplate) {
      assert.equal(bestTemplate.attr('title'), 'Best Template');
    });
  });

  it('update', function(done) {
    let a2jTemplate = new A2JTemplate({title: 'Best Template'});

    a2jTemplate.save().then(function(bestTemplate) {
      assert.equal(bestTemplate.attr('title'), 'Best Template');

      let templateId = bestTemplate.attr('templateId');

      bestTemplate.attr('title', 'Bestest Template');

      bestTemplate.save().then(function(bestestTemplate) {
        assert.equal(bestestTemplate.attr('title'), 'Bestest Template');
        assert.equal(bestestTemplate.attr('templateId'), templateId);
        done();
      });
    });
  });

  it('destroy', function(done) {
    let promise = A2JTemplate.findAll({guideId: 1261});

    promise.then(function(a2jTemplates) {
      let destroyPromises = a2jTemplates.map(function(a2jTemplate) {
        if (a2jTemplate.attr('templateId') >= 3000) {
          return a2jTemplate.destroy();
        }
      });

      can.when.apply(this, destroyPromises).done(() => { done(); });
    });
  });

  it('addNode', function() {
    let promise = A2JTemplate.findOne({templateId: 2112});

    return promise.then(function(a2jTemplate) {
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

  it('search - filters list that matches title', function() {
    let result;
    let templates = new A2JTemplate.List([{title: 'foo'}, {title: 'bar o'}]);

    result = templates.search('baz');
    assert.equal(result.attr('length'), 0, 'no templates with baz title');

    result = templates.search('foo');
    assert.equal(result.attr('length'), 1, 'there is one match');

    result = templates.search('o');
    assert.equal(result.attr('length'), 2, 'there are two matches');
  });
});

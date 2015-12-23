import assert from 'assert';
import A2JNode from '../a2j-node';

import 'steal-mocha';

describe('A2JNode', function() {

  it('serializes state properly', function() {
    let node = new A2JNode();
    let state = node.attr('state');

    let expected = {
      children: [],
      component: '',
      state: {
        foo: 'bar'
      }
    };

    state.attr({
      foo: 'bar',
      answers: [],
      useAnswers: true,
      guide: {foo: 'bar'},
    });

    // properties like `guide` and `answers` are removed since they are only
    // required in the client for edit purposes, but not when persisted in
    // the server.
    assert.deepEqual(node.serialize(), expected);
  });

});

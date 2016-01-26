import assert from 'assert';
import _omit from 'lodash/omit';
import A2JNode from '../a2j-node';

import 'steal-mocha';

describe('A2JNode', function() {

  it('serializes state properly', function() {
    const node = new A2JNode();
    const state = node.attr('state');

    const expected = {
      tag: '',
      children: [],
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

    // id is an autogenerated cuid
    const actual = _omit(node.serialize(), 'id');

    // properties like `guide` and `answers` are removed since they are only
    // required in the client for edit purposes, but not when persisted in
    // the server.
    assert.deepEqual(actual, expected);
  });

});

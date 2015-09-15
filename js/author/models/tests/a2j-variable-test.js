import A2JVariable from '../a2j-variable';
import assert from 'assert';
import 'steal-mocha';

describe('A2JVariable Model', () => {
  it('findOne (variable found)', () => {
    let originalGuide = window.gGuide;
    window.gGuide = {};

    gGuide.vars = {
      'a b c': {
        name: 'A B C',
        repeating: false,
        values: [ null, 'alphabet' ]
      },
      '1 2 3': {
        name: 'One Two Three',
        repeating: false,
        values: [ null,'numbers' ]
      }
    };

    return A2JVariable.findOne({ name: 'A B C' }).then((a2jvariable) => {
      assert.equal(a2jvariable.attr('values.1'), 'alphabet');
      window.gGuide = originalGuide;
    });
  });

  it.only('findOne (variable not found)', () => {
    return A2JVariable.findOne({ name: 'not found' }).then((a2jvariable) => {
      assert.strictEqual(a2jvariable.attr('values.1'), undefined);
    });
  });
});

import assert from 'assert';
import Answers from 'caja/viewer/models/answers';

import 'steal-mocha';

describe('Answers Model', function() {
  it('does not set TF vars to non boolean values', function () {
    const answers = new Answers();
    answers.varCreate('gotMilk', 'TF', 'false');

    answers.varSet('gotMilk', 'maximus', 1);
    assert.equal(answers.varGet('gotMilk', 1), undefined, 'should return undefined for no boolean types');
    answers.varSet('gotMilk', null, 1);
    assert.equal(answers.varGet('gotMilk', 1), undefined, 'should return undefined when nulled out');
  });

  it('should set proper boolean values for TF vars', function () {
    const answers = new Answers();
    answers.varCreate('gotMilk', 'TF', 'false');

    answers.varSet('gotMilk', true, 1);
    assert.equal(answers.varGet('gotMilk', 1), true, 'did not set to boolean true');
    answers.varSet('gotMilk', false, 1);
    assert.equal(answers.varGet('gotMilk', 1), false, 'did not set to boolean false');
  });
});

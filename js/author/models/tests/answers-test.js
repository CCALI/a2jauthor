import assert from 'assert';
import Answers from '../answers';

import 'steal-mocha';

describe('Answers', function() {
  let answers;

  beforeEach(function() {
    let fixture = {
      'client first name': {
        values: [null],
        repeating: false,
        name: 'Client First Name'
      },

      'child name': {
        type: 'Text',
        repeating: true,
        name: 'Child Name',
        values: [null, 'Bart', 'Lisa', 'Maggie']
      }
    };

    answers = new Answers(fixture);
  });

  it('getVariable - returns undefined if no answer is available', function() {
    // Client Last Name has no key/val in answers.
    assert.isUndefined(answers.getVariable('client last name'));
    assert.isUndefined(answers.getVariable('Client Last Name'));
  });

  it('getVariable - returns variable object from answers if available', function() {
    let variable = answers.getVariable('Client First Name');

    assert.isFalse(variable.attr('repeating'));
    assert.equal(variable.attr('name'), 'Client First Name');
  });

  it('getValue - returns single value for non repeating vars', function() {
    let variable = answers.getVariable('Client First Name');

    variable.attr('values').push('John');

    assert.isFalse(variable.attr('repeating'));
    assert.equal(answers.getValue('Client First Name'), 'John');
  });

  it('getValue - return value at given index for repeating vars', function() {
    let varName = 'child name';
    let variable = answers.getVariable(varName);

    assert.isTrue(variable.attr('repeating'));

    // the null at values[0] is dropped, and [varIndex] starts
    // at the next value in the array.
    assert.equal(answers.getValue(varName, 0), 'Bart');
    assert.equal(answers.getValue(varName, 2), 'Maggie');
    assert.isUndefined(answers.getValue(varName, 99));
  });

  // this applies to use case when no index is provided and the variable
  // has only one value (after dropping first null value).
  it('getValue - returns value at last index for repeating vars', function() {
    let varName = 'Client First Name';
    let variable = answers.getVariable(varName);

    variable.attr('repeating', true);
    variable.attr('values').push('John');

    assert.isTrue(variable.attr('repeating'));
    assert.deepEqual(variable.attr('values').attr(), [null, 'John']);

    assert.equal(answers.getValue(varName), 'John');
  });

  // this applies for repeating variables with more than 2 values
  it('getValue - returns a comma separated string if index is not provided', function() {
    let varName = 'child name';
    let variable = answers.getVariable(varName);

    assert.isTrue(variable.attr('repeating'));
    assert.equal(answers.getValue(varName), 'Bart, Lisa and Maggie');
  });
});

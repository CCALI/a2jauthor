import assert from 'assert';
import Answer from 'viewer/models/answer';
import Answers from 'viewer/models/answers';
import AnswerVM from 'viewer/models/answervm';

import 'steal-mocha';

describe('AnswerViewModel', function() {

  it('serialize', function() {
    const answers = new Answers();

    const answer = new Answer({
      type: 'text',
      values: [null],
      repeating: false,
      name: 'user gender'
    });

    answers.attr('user gender', answer);
    const avm = new AnswerVM({ answer });

    avm.attr('values', 'm');
    assert.deepEqual(answers.serialize(), {
      'user gender': {
        type: 'text',
        repeating: false,
        name: 'user gender',
        values: [null, 'm']
      }
    }, 'single value serialize');

    avm.attr('answerIndex', 2);
    avm.attr('values', 'f');
    assert.deepEqual(answers.serialize(), {
      'user gender': {
        type: 'text',
        repeating: false,
        name: 'user gender',
        values: [null, 'm', 'f']
      }
    }, 'multiple values serialize');
  });

  it('set() when answer is null', function() {
    const avm = new AnswerVM({ answer: null });

    assert.doesNotThrow(() => {
      avm.attr('values', false);
    });

    assert.deepEqual(avm.attr('answer.values').attr(), [null, false]);
  });
});

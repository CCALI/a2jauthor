import assert from 'assert';
import Answers from 'viewer/models/answers';
import AnswerVM from 'viewer/models/answervm';
import Interview from 'viewer/models/interview';

import 'steal-mocha';

describe('AnswerViewModel', function() {

  it('serialize', function() {
    let answers = new Answers();

    let interview = new Interview({
      pages: [{
        fields: [{
          name: 'user gender',
          type: 'text'
        }]
      }, {
        fields: [{
          name: 'user gender',
          type: 'text'
        }]
      }],
      answers: answers
    });

    var answer = interview.attr('pages.0.fields.0.answer');

    var avm = new AnswerVM({
      answer: answer
    });

    avm.attr('values', 'm');
    assert.deepEqual(answers.serialize(), {
      'user gender': {
        name: 'user gender',
        type: 'text',
        values: [null, 'm']
      }
    }, 'single value serialize');

    avm.attr('answerIndex', 2);
    avm.attr('values', 'f');

    assert.deepEqual(answers.serialize(), {
      'user gender': {
        name: 'user gender',
        type: 'text',
        values: [null, 'm', 'f']
      }
    }, 'multiple values serialize');
  });

  it('set() when answer is null', () => {
    let avm = new AnswerVM({
      answer: null
    });

    assert.doesNotThrow(() => {
      avm.attr('values', false)
    });

    assert.deepEqual(avm.attr('answer.values').attr(), [ null, false ]);
  });
});

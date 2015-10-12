import assert from 'assert';
import Answers from 'client/models/answers';
import AnswerVM from 'client/models/answervm';
import Interview from 'client/models/interview';

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

});

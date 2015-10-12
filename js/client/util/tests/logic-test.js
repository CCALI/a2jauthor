import assert from 'assert';
import Logic from 'client/util/logic';
import Answer from 'client/models/answer';
import Answers from 'client/models/answers';
import AnswerVM from 'client/models/answervm';
import Interview from 'client/models/interview';

describe('Logic', function() {
  let logic;
  let answers;
  let interview;

  beforeEach(function() {
    answers = new Answers();

    interview = new Interview({
      _pages: {
        '1-Introduction': {
          name: '1-Introduction',
          fields: [{
            name: 'firstname',
            type: 'text'
          }, {
            name: 'middlename',
            type: 'text'
          }, {
            name: 'lastname',
            type: 'text'
          }]
        },
        '1-job loss date': {
          name: '1-Introduction',
        }
      },
      pages: [{
        name: '1-Introduction',
        fields: [{
          name: 'firstname',
          type: 'text'
        }, {
          name: 'middlename',
          type: 'text'
        }, {
          name: 'lastname',
          type: 'text'
        }]
      }, {
        name: '1-Introduction',
        fields: []
      }],
      answers: answers
    });

    let avm = new AnswerVM({
      answer: interview.attr('pages.0.fields.0.answer')
    });
    avm.attr('values', 'John');

    avm = new AnswerVM({
      answer: interview.attr('pages.0.fields.2.answer')
    });
    avm.attr('values', 'Doe');

    logic = new Logic({
      interview: interview
    });
  });

  it('simple set', function() {
    logic.exec('set firstname to "Bob"');

    assert.deepEqual(answers.serialize(), {
      'firstname': {
        name: 'firstname',
        type: 'text',
        values: [null, 'Bob']
      },
      'lastname': {
        name: 'lastname',
        type: 'text',
        values: [null, 'Doe']
      }
    }, 'values set');
  });

  it('simple goto', function() {
    let codeBefore = 'GOTO "1-job loss date"';
    logic.exec(codeBefore);

    assert.equal(logic.attr('gotoPage'), '1-job loss date', 'target page set');
  });

  it('conditional goto', function() {
    let codeBefore =
      `if firstname = "John"<BR/>
      GOTO "1-job loss date"<BR/>
      end if`;

    logic.exec(codeBefore);
    assert.equal(logic.attr('gotoPage'), '1-job loss date', 'target page set');
  });

  it('eval text', function() {
    assert.equal(logic.eval('%%1+1%%'), '2', 'simple eval');
    assert.equal(logic.eval('%%firstname%%'), 'John', 'simple token interpolation');
    assert.equal(logic.eval('%%firstname%% %%FIRSTname%%'), 'John John', 'multiple token interpolation w/ case');
  });

  it('conditional set w/ linebreaks', function() {
    let str =
      `if middlename = ""<BR/>
      set fullname to firstname + " " + lastname<BR/>
      else<BR/>
      set fullname to firstname + " " + middlename + " " + lastname<BR/>
      end if`;

    let avm = new AnswerVM({
      answer: interview.attr('pages.0.fields.1.answer')
    });
    avm.attr('values', '');

    answers.attr('fullname', new Answer({
      name: 'fullname',
      type: 'text',
      repeating: false,
      values: [null]
    }));

    logic.exec(str);

    assert.deepEqual(answers.serialize(), {
      'fullname': {
        name: 'fullname',
        repeating: false,
        type: 'text',
        values: [null, 'John Doe']
      },
      'firstname': {
        name: 'firstname',
        type: 'text',
        values: [null, 'John']
      },
      'lastname': {
        name: 'lastname',
        type: 'text',
        values: [null, 'Doe']
      },
      'middlename': {
        name: 'middlename',
        type: 'text',
        values: [null, '']
      }
    }, 'values set without extra whitespace');

    //setting middlename
    avm.attr('values', 'T');

    logic.exec(str);

    assert.deepEqual(answers.serialize(), {
      'fullname': {
        name: 'fullname',
        repeating: false,
        type: 'text',
        values: [null, 'John T Doe']
      },
      'firstname': {
        name: 'firstname',
        type: 'text',
        values: [null, 'John']
      },
      'lastname': {
        name: 'lastname',
        type: 'text',
        values: [null, 'Doe']
      },
      'middlename': {
        name: 'middlename',
        type: 'text',
        values: [null, 'T']
      }
    }, 'middle name set');
  });
});

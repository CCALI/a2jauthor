import assert from 'assert'
import Answers from 'caja/viewer/models/answers'

import 'steal-mocha'

describe('Answers Model', function () {
  it('does not set TF vars to non boolean values', function () {
    const answers = new Answers()
    answers.varCreate('gotMilk', 'TF', 'false')

    answers.varSet('gotMilk', 'maximus', 1)
    assert.equal(answers.varGet('gotMilk', 1), undefined, 'should return undefined for no boolean types')
    answers.varSet('gotMilk', null, 1)
    assert.equal(answers.varGet('gotMilk', 1), undefined, 'should return undefined when nulled out')
  })

  it('should set proper boolean values for TF vars', function () {
    const answers = new Answers()
    answers.varCreate('gotMilk', 'TF', 'false')

    answers.varSet('gotMilk', true, 1)
    assert.equal(answers.varGet('gotMilk', 1), true, 'did not set to boolean true')
    answers.varSet('gotMilk', false, 1)
    assert.equal(answers.varGet('gotMilk', 1), false, 'did not set to boolean false')
  })

  it('should get boolean values for TF vars', function () {
    const answers = new Answers()
    answers.varCreate('gotMilk', 'TF', 'false')
    assert.equal(answers.varGet('gotMilk', 1), undefined, 'new TF vars should be set to undefined')

    answers.gotmilk.attr('values').push('true')
    assert.equal(answers.varGet('gotMilk', 1), true, 'should cast legacy string values to boolean')
  })

  it('handles zero and falsey valuse for number types', function () {
    const answers = new Answers()
    answers.varCreate('numberFest', 'number', 'false')
    assert.equal(answers.varGet('numberFest', 1), undefined, 'should get undefined when unanswered')

    answers.varSet('numberFest', 0, 1)
    assert.equal(answers.varGet('numberFest', 1), 0, 'should get 0 when value is 0')

    answers.varSet('numberFest', null, 1)
    assert.equal(answers.varGet('numberFest', 1), null, 'should get null as when number cleared by logic')
  })
})

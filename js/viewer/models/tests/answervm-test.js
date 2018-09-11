import { assert } from 'chai'
import Field from 'caja/viewer/models/field'
import Answer from 'caja/viewer/models/answer'
import Answers from 'caja/viewer/models/answers'
import AnswerVM from 'caja/viewer/models/answervm'

import 'steal-mocha'

describe('AnswerViewModel', function () {
  it('serialize', function () {
    const answers = new Answers()

    const answer = new Answer({
      type: 'text',
      values: [null],
      repeating: false,
      name: 'user gender'
    })

    answers.attr('user gender', answer)
    const avm = new AnswerVM({ answer })

    avm.attr('values', 'm')
    assert.deepEqual(answers.serialize(), {
      'user gender': {
        type: 'text',
        repeating: false,
        name: 'user gender',
        values: [null, 'm']
      }
    }, 'single value serialize')

    avm.attr('answerIndex', 2)
    avm.attr('values', 'f')
    assert.deepEqual(answers.serialize(), {
      'user gender': {
        type: 'text',
        repeating: false,
        name: 'user gender',
        values: [null, 'm', 'f']
      }
    }, 'multiple values serialize')
  })

  it('set() when answer is null', function () {
    const avm = new AnswerVM({ answer: null })

    assert.doesNotThrow(() => {
      avm.attr('values', false)
    })

    assert.deepEqual(avm.attr('answer.values').attr(), [null, false])
  })

  it('sets number field answer correctly from text input', function () {
    const field = new Field({ name: 'foo', type: 'number' })
    field.attr('answer', field.attr('emptyAnswer'))

    const avm = new AnswerVM({ field, answer: field.attr('answer') })
    avm.attr('values', '123,456.78')

    assert.deepEqual(avm.attr('answer.values').attr(), [null, 123456.78])
  })

  it('does not set invalid dates', function () {
    const field = new Field({ name: 'foo', type: 'datemdy' })
    field.attr('answer', field.attr('emptyAnswer'))

    const avm = new AnswerVM({ field, answer: field.attr('answer') })
    avm.attr('values', 'invalid date')
    assert.equal(avm.attr('values'), '', 'should return empty string')
  })

  it('date types with no answer should not default to today', function () {
    const field = new Field({ name: 'foo', type: 'datemdy' })
    field.attr('answer', field.attr('emptyAnswer'))

    const avm = new AnswerVM({ field, answer: field.attr('answer') })
    assert.equal(avm.attr('values'), '', 'should return empty string')
  })

  describe('validating checkboxes', function () {
    let checkboxes

    beforeEach(function () {
      const checkboxFactory = function () {
        const checkbox = new Field({
          name: 'foo',
          required: true,
          type: 'checkbox',
          repeating: false
        })

        checkbox.attr('answer', checkbox.attr('emptyAnswer'))
        return checkbox
      }

      checkboxes = new Field.List([
        checkboxFactory(),
        checkboxFactory(),
        checkboxFactory()
      ])

      checkboxes.forEach(function (checkbox) {
        checkbox.attr('_answer', new AnswerVM({
          answerIndex: 1,
          field: checkbox,
          fields: checkboxes,
          answer: checkbox.attr('answer')
        }))
      })
    })

    it('fails if no required checkbox has been checked', function () {
      const checkbox = checkboxes.attr(0)

      // trigger the validation logic
      checkbox.attr('_answer.values', null)

      assert.equal(checkbox.attr('_answer.errors'), true, 'should fail')
    })

    it('does not fail if a required checkbox has been checked', function () {
      const checkbox = checkboxes.attr(0)

      // trigger the validation logic
      checkbox.attr('_answer.values', 'foo')

      assert.equal(checkbox.attr('_answer.errors'), null, 'should not fail')
    })

    it('does not fail if none of the checkboxes is required', function () {
      checkboxes.forEach(function (checkbox) {
        checkbox.attr('required', false)
      })

      // trigger the validation logic
      const checkbox = checkboxes.attr(0)
      checkbox.attr('_answer.values', null)

      assert.equal(checkbox.attr('_answer.errors'), undefined, 'should not fail')
    })
  })
})

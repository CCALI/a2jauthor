import { assert } from 'chai'
import Answers from 'caja/author/models/answers'
import evalAuthorCondition from './eval-author-condition'

import 'steal-mocha'

describe('evalAuthorCondition', function () {
  let answers

  beforeEach(function () {
    answers = new Answers({
      'contracts amount over 5k mc': {
        repeating: false,
        values: [null, true],
        name: 'Contracts amount over 5k MC'
      },

      'minor children tf': {
        repeating: false,
        values: [null, 'false'],
        name: 'Minor Children TF'
      },

      'mother monthly income': {
        repeating: false,
        values: [null, '100'],
        name: 'Mother Monthly Income'
      },

      'father monthly income': {
        repeating: false,
        values: [null, '100'],
        name: 'Father Monthly Income'
      }
    })
  })

  it('unary operation with variable operand', function () {
    assert.isTrue(evalAuthorCondition({
      answers,
      operator: 'is-true',
      leftOperandType: 'variable',
      leftOperand: 'Contracts amount over 5k MC'
    }))
    assert.isFalse(evalAuthorCondition({
      answers,
      operator: 'is-false',
      leftOperandType: 'variable',
      leftOperand: 'Contracts amount over 5k MC'
    }))
  })

  it('unary operation with variable operand and string values', function () {
    assert.isFalse(evalAuthorCondition({
      answers,
      operator: 'is-true',
      leftOperandType: 'variable',
      leftOperand: 'Minor Children TF'
    }))

    assert.isTrue(evalAuthorCondition({
      answers,
      operator: 'is-false',
      leftOperandType: 'variable',
      leftOperand: 'Minor Children TF'
    }))
  })

  // leftOperand === rightOperand
  it('is-equal operator with variable operands', function () {
    assert.isTrue(evalAuthorCondition({
      answers,
      operator: 'is-equal',
      leftOperandType: 'variable',
      rightOperandType: 'variable',
      leftOperand: 'mother monthly income',
      rightOperand: 'father monthly income'
    }))
  })

  // leftOperand === rightOperand
  it('is-not-equal operator with variable operands', function () {
    assert.isFalse(evalAuthorCondition({
      answers,
      operator: 'is-not-equal',
      leftOperandType: 'variable',
      rightOperandType: 'variable',
      leftOperand: 'mother monthly income',
      rightOperand: 'father monthly income'
    }))
  })
})

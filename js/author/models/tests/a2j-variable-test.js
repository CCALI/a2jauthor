import { assert } from 'chai'
import A2JVariable from '../a2j-variable'

import 'steal-mocha'

describe('A2JVariable Model', function () {
  it('findOne (variable found)', function () {
    let originalGuide = window.gGuide
    window.gGuide = {}

    gGuide.vars = {
      'a b c': {
        name: 'A B C',
        repeating: false,
        values: [null, 'alphabet']
      },
      '1 2 3': {
        name: 'One Two Three',
        repeating: false,
        values: [null, 'numbers']
      }
    }

    let promise = A2JVariable.findOne({ name: 'A B C' })

    return promise.then(function (a2jvariable) {
      assert.equal(a2jvariable.attr('values.1'), 'alphabet')
      window.gGuide = originalGuide
    })
  })

  it('findOne (variable not found)', function () {
    let promise = A2JVariable.findOne({ name: 'not found' })

    return promise.then(function (a2jvariable) {
      assert.isUndefined(a2jvariable.attr('values.1'))
    })
  })

  it('fromGuideVars', function () {
    let list = A2JVariable.fromGuideVars({
      'foo bar': {
        name: 'Foo Bar',
        repeating: false,
        values: [null, 'alphabet']
      },
      'baz qux': {
        name: 'Baz Qux',
        repeating: false,
        values: [null, 'numbers']
      }
    })

    assert.equal(list.attr('length'), 2)
    assert.instanceOf(list, A2JVariable.List)
    assert.include(list.attr('0.name'), 'Foo Bar')
  })
})

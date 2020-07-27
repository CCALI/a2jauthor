import { assert } from 'chai'
import moveItem from '../move-item-array'

import 'steal-mocha'

describe('moveItemArray', function () {
  it('moves item up in the array', function () {
    let a = [1, 2, 3, 4]
    let b = moveItem(a, 0, 2)
    assert.deepEqual(b, [2, 3, 1, 4])
  })

  it('moves item down in the array', function () {
    let a = [1, 2, 3, 4]
    let b = moveItem(a, 3, 0)
    assert.deepEqual(b, [4, 1, 2, 3])
  })

  it('returns undefined if indexes out of bound', function () {
    let a = [1]
    let b = moveItem(a, 3, 4)
    assert.isUndefined(b)
  })
})

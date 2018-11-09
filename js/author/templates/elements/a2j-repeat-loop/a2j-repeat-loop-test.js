import { assert } from 'chai'
import RepeatLoopVM from './a2j-repeat-loop-vm'

describe('<a2j-repeat-loop>', function () {
  describe('viewModel', function () {
    let vm

    const answers = {
      childcounter: {
        name: 'ChildCounter',
        type: 'Number',
        repeating: false,
        values: [null, 3]
      },

      'first name': {
        name: 'First Name',
        type: 'Text',
        repeating: false,
        values: [null, 'John']
      },

      'child name': {
        name: 'Child Name',
        type: 'Text',
        repeating: true,
        values: [null, 'Bart', 'Lisa', 'Maggie']
      }
    }

    beforeEach(function () {
      vm = new RepeatLoopVM({
        answers,
        loopType: 'variable',
        loopVariable: 'ChildCounter'
      })
    })

    it('getAnswer returns answer object given variable name', function () {
      let variable = vm.getAnswer('ChildCounter').attr()
      assert.deepEqual(variable, answers.childcounter)
    })

    it('rangeFromVariable create a range given variable name', function () {
      let range = vm.rangeFromVariable('ChildCounter').attr()
      assert.deepEqual(range, [0, 1, 2], 'childcounter value is 3')
    })

    it('loopCollection is a range up to either [loopCounter] or [loopVariable]', function () {
      assert.equal(vm.attr('loopType'), 'variable')
      assert.deepEqual(vm.attr('loopCollection').attr(), [0, 1, 2],
        'childcounter value is 3')

      vm.attr('loopCounter', 5)
      vm.attr('loopType', 'counter')
      assert.deepEqual(vm.attr('loopCollection').attr(), [0, 1, 2, 3, 4],
        'loopCounter value is 5')
    })
  })
})

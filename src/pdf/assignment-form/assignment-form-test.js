import 'steal-mocha'
import { assert } from 'chai'
import { AssignmentFormVm } from './assignment-form'

describe('Assignment Form', function () {
  describe('AssignmentFormVM', function () {
    it('updateBufferWithVariable - default overflow option', () => {
      const vm = new AssignmentFormVm()
      // set variable
      const textVar = { comment: '', repeating: false, name: 'middle', type: 'Text' }
      vm.attr('selectedVariable', textVar.name)
      vm.attr(`variableDict.${textVar.name}`, textVar)

      vm.updateBufferWithVariable()
      const variableBuffer = vm.attr('variableBuffer')
      assert.equal(variableBuffer.attr('overflowStyle'), 'clip-overflow', 'should set a default style of clip-overflow on Text variables')
    })
  })
})

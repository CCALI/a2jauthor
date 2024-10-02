import { assert } from 'chai'
import { VarPickerFieldVM } from './var-picker-field'
import AppState from 'a2jauthor/src/models/app-state'

import 'steal-mocha'

// ViewModel unit tests
describe('<VarPickerField>', () => {
  describe('viewModel', () => {
    const testVar = {
      name: 'Test Variable',
      type: 'Text'
    }
    const testField = {
      name: 'Test Variable',
      type: 'text'
    }
    const appState = new AppState({ guide: { vars: { 'test variable': testVar } } })
    let vm

    beforeEach(() => {
      vm = new VarPickerFieldVM({ appState })
    })

    it('showMessage - type mismatch', () => {
      vm.obj = testField
      vm.key = 'name'
      vm.filterText = 'Test Variable'

      vm.expectedVarType = 'number'
      assert.equal(vm.showMessage, true, 'should return true when health problem found aka types dont match')

      vm.expectedVarType = 'text'
      assert.equal(vm.showMessage, false, 'should return false/hide message when types match')
    })

    it('showMessage - unknown variable name', () => {
      const originalName = testField.name
      testField.name = 'Bad Var'
      vm.obj = testField
      vm.key = 'name'

      const expectedHealthMessage = 'Variable Not Found, please assign a valid Variable Name'
      assert.equal(vm.showMessage, true, 'should return true when unknown variable found ex: typo')
      assert.equal(vm.message, expectedHealthMessage, 'should show variable not found message')

      testField.name = originalName
    })

    it('message', () => {
      vm.obj = testField
      vm.key = 'name'
      vm.filterText = 'Test Variable'

      vm.expectedVarType = 'number'

      assert.equal(vm.message, 'Found Variable Type: (text) but expected Variable Type: (number)', 'should return a message describing mixed field/var types')
    })
  })
})

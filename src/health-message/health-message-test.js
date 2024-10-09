import { HealthMessageVM } from './health-message'
import stache from 'can-stache'
import canViewModel from 'can-view-model'
import { assert } from 'chai'
import $ from 'jquery'

import 'steal-mocha'

describe('<health-message>', () => {
  describe('viewModel', () => {
    let vm
    const testProps = {
      showMessage: true,
      alertClass: 'danger',
      message: 'Danger Zone!'
    }

    beforeEach(() => {
      vm = new HealthMessageVM(testProps)
    })

    it('passes simple smoke test', () => {
      const expectedMessage = 'Danger Zone!'
      const expectedAlertClass = 'danger'
      const expectedShowMessage = true

      assert.equal(vm.message, expectedMessage, 'message should show Danger Zone!')
      assert.equal(vm.alertClass, expectedAlertClass, 'alertClass should be danger')
      assert.equal(vm.showMessage, expectedShowMessage, 'showMessage should be true')
    })
  })

  describe('Component', () => {
    // let vm

    afterEach(() => {
      document.getElementById('test-area').innerHTML = ''
    })

    it('shows a warning level message', () => {
      const render = (data) => {
        const tpl = stache(`
        <health-message 
          showMessage:raw="true" 
          message:raw="This is a warning message" 
          alertClass:raw="warning"
        />`)

        document.querySelector('#test-area').appendChild(tpl(data))

        return canViewModel('health-message')
      }

      render()

      const messageEl = $('health-message')
      assert.isTrue(messageEl.is(':visible'), 'should be visible')
    })
  })
})

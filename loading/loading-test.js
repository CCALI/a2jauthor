import { assert } from 'chai'
import 'steal-mocha'
import { LoadingVM } from './loading'

describe('<app-loading>', function () {
  describe('viewModel', function () {
    let vm
    beforeEach(() => {
      vm = new LoadingVM()
    })

    it('has a default loading loadingMessage', () => {
      assert.equal(vm.loadingMessage, 'Loading ...', 'should display default loading message if none passed')
    })

    it('should take a custom loadingMessage', () => {
      vm.loadingMessage = 'Building Report ...'
      assert.equal(vm.loadingMessage, 'Building Report ...', 'should match passed in custom loading message')
    })
  })
})

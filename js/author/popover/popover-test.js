import { assert } from 'chai'
import { Popover } from './popover'

import 'steal-mocha'

describe('<app-popover>', function () {
  describe('viewModel', function () {
    let vm

    beforeEach(function () {
      vm = new Popover()
    })

    it('defaults placement to "right"', function () {
      assert.equal(vm.attr('placement'), 'right')
    })

    it('return default placement if set to invalid value', function () {
      vm.attr('placement', 'foo')
      assert.equal(vm.attr('placement'), 'right', '"foo" is not a valid placement')

      vm.attr('placement', 'left')
      assert.equal(vm.attr('placement'), 'left', 'should be "left"')
    })
  })
})

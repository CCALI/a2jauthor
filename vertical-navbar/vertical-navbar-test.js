import { assert } from 'chai'
import { VerticalNavbarVM } from './vertical-navbar'

import 'steal-mocha'

describe('<vertical-navbar>', () => {
  describe('viewModel', () => {
    let vm

    beforeEach(() => {
      vm = new VerticalNavbarVM()
    })

    it('defaults \'position\' to left', () => {
      assert.equal(vm.attr('position'), 'left')
    })

    it('defaults \'theme\' to default', () => {
      assert.equal(vm.attr('theme'), 'default')
    })

    it('enforces left or right as \'position\' values', () => {
      vm.attr('position', 'foo')
      assert.equal(vm.attr('position'), 'left', 'foo is not a valid position')

      vm.attr('position', 'right')
      assert.equal(vm.attr('position'), 'right')
    })

    it('enforces default or inverse as \'theme\' values', () => {
      vm.attr('theme', 'bar')
      assert.equal(vm.attr('theme'), 'default', 'bar is not a valid theme')

      vm.attr('theme', 'inverse')
      assert.equal(vm.attr('theme'), 'inverse')
    })
  })
})

import { assert } from 'chai'
import { ColorChipsVm } from 'caja/author/color-chips/'

import 'steal-mocha'

describe('<color-chips>', () => {
  describe('viewModel', () => {
    let vm

    const colorClasses = [
      'red',
      'orange',
      'green',
      'blue'
    ]

    beforeEach(() => {
      vm = new ColorChipsVm({ colorClasses: colorClasses })
    })

    it('onSelect', () => {
      var handler = (colorClass) => {
        vm.attr('selectedColorClass', colorClass)
      }
      vm.attr('onColorClass', handler)
      vm.onSelect(colorClasses[1])()

      assert.equal(vm.attr('selectedColorClass'), colorClasses[1], 'should call onSelect handler and update selectedColorClass')
    })
  })
})

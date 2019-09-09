import { ClientAvatarPickerVm } from './client-avatar-picker'
import { assert } from 'chai'

import 'steal-mocha'

describe('<client-avatar-picker>', () => {
  describe('viewModel', () => {
    let vm

    beforeEach(() => {
      vm = new ClientAvatarPickerVm()
    })

    it('avatars', () => {
      assert.equal(vm.attr('avatars').length, 8, 'returns a list of mapped avatars')
      assert.equal(vm.attr('femaleAvatars').length, 4, 'returns female avatars')
      assert.equal(vm.attr('maleAvatars').length, 4, 'returns male avatars')
    })
  })
})

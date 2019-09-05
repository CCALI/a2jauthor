import { ClientAvatarPickerVm } from './client-avatar-picker'
import { assert } from 'chai'

import 'steal-mocha'

describe('<client-avatar-picker>', () => {
  describe('viewModel', () => {
    let vm = new ClientAvatarPickerVm()
    it('avatars', () => {
      const mappedAvatars = vm.attr('avatars')
      assert.equal(mappedAvatars.length, 8, 'returns a list of mapped avatars')
    })
  })
})

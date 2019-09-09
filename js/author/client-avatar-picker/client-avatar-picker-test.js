import { ClientAvatarPickerVm } from './client-avatar-picker'
import stache from 'can-stache'
import { assert } from 'chai'
import $ from 'jquery'

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

describe('Component', () => {
  beforeEach((done) => {
  //   <client-avatar-picker
  //   hair:from="clientAvatar.hairColor"
  //   skin:from="clientAvatar.skinTone"
  //   gender:from="clientAvatar.gender"
  //   isOld:from="clientAvatar.isOld"
  //   hasWheelchair:from="clientAvatar.hasWheelchair"
  //   onAvatar:from="onClientAvatarChange"
  // />
    const clientAvatar = {
      hair: 'red',
      skin: 'dark',
      gender: 'female',
      isOld: 'false',
      hasWheelchair: 'false'
    }
    const frag = stache(
      '<client-avatar-picker />'
    )

    $('#test-area').html(frag({ }))
  })

  afterEach((done) => {
    $('#test-area').empty()
    done()
  })

  // it('has a picker', (done) => {
  //   assert.ok(true)
  //   done()
  // })
})

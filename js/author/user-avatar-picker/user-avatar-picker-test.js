import $ from 'jquery'
import { assert } from 'chai'
import stache from 'can-stache'
import { UserAvatarPickerVm, AvatarPick } from 'caja/author/user-avatar-picker/'

import 'steal-mocha'

describe('<user-avatar-picker>', () => {
  describe('viewModel', () => {
    let vm
    let teardown

    const startingAvatar = {
      gender: 'female',
      isOld: false,
      hasWheelchair: false,
      hair: 'darkBrown',
      skin: 'medium'
    }

    beforeEach(() => {
      vm = new UserAvatarPickerVm({ userAvatar: startingAvatar })
      teardown = vm.connectedCallback()
    })

    afterEach(() => {
      teardown()
    })

    it('avatars', () => {
      assert.isTrue(vm.avatars instanceof AvatarPick.List, 'should be an AvatarPick.List')
      assert.isTrue(vm.avatars[0] instanceof AvatarPick, 'should contain AvatarPick Types')
      assert.equal(vm.avatars.length, 8, 'returns a list of mapped avatars')
      assert.equal(vm.femaleAvatars.length, 4, 'returns female avatars')
      assert.equal(vm.maleAvatars.length, 4, 'returns male avatars')
    })

    it('fireAvatar', () => {
      let testAvatar
      // handler passed in via stache
      vm.onAvatar = (avatar) => {
        testAvatar = avatar
      }

      const avatarIndex = 0
      vm.fireAvatar(avatarIndex)
      assert.deepEqual(testAvatar, {gender: 'female', isOld: false, hasWheelchair: false}, 'should fire passed in onAvatar handler')
    })

    it('isSelected', () => {
      const avatars = vm.avatars
      const selectedAvatar = avatars[0]
      const notSelectedAvatar = avatars[1]

      assert.isTrue(vm.isSelected(selectedAvatar), 'should return true when vm.userAvatar values match')
      assert.isFalse(vm.isSelected(notSelectedAvatar), 'should return false when vm.userAvatar values do not match')
    })

    it('updateSkin', () => {
      vm.skin = 'darker'

      const skinToneMap = vm.avatars.filter((avatar) => { return avatar.skin === 'darker' })
      assert.equal(skinToneMap.length, 8, 'vm.skin tone changes should update all avatars skin tone')
    })

    it('updateHair', () => {
      vm.hair = 'red'

      const hairColorMap = vm.avatars.filter((avatar) => { return avatar.hair === 'red' })
      assert.equal(hairColorMap.length, 8, 'vm.hair color changes should update all avatars hair color')
    })
  })

  describe('Component', () => {
    let vm
    beforeEach(() => {
      const startingAvatar = {
        gender: 'female',
        isOld: false,
        hasWheelchair: false,
        hair: 'darkBrown',
        skin: 'medium'
      }

      let frag = stache('<user-avatar-picker />')
      $('#test-area').html(frag({ userAvatar: startingAvatar }))
      vm = $('user-avatar-picker')[0].viewModel
    })

    afterEach(() => {
      $('#test-area').empty()
    })

    it('has avatar picks', () => {
      const a2jAvatars = $('a2j-viewer-avatar')
      assert.equal(a2jAvatars.length, 8, 'should be 8 avatars to pick from')
    })

    it('onAvatar on click', () => {
      let fired
      vm.onAvatar = () => { fired = true }
      $('a2j-viewer-avatar')[0].click()

      assert.isTrue(fired, 'onAvatar handler should fire on click')
    })
  })
})

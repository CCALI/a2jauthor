import Map from 'can-map'
import Component from 'can-component'
import template from './client-avatar-picker.stache'
import {
  Hair,
  Skin,
  Gender
} from 'viewer/desktop/avatar/colors'

const baseAvatars = [
  {gender: 'female', isOld: false, hasWheelchair: false},
  {gender: 'female', isOld: false, hasWheelchair: true},
  {gender: 'female', isOld: true, hasWheelchair: false},
  {gender: 'female', isOld: true, hasWheelchair: true},
  {gender: 'male', isOld: false, hasWheelchair: false},
  {gender: 'male', isOld: false, hasWheelchair: true},
  {gender: 'male', isOld: true, hasWheelchair: false},
  {gender: 'male', isOld: true, hasWheelchair: true}
]

export const ClientAvatarPickerVm = Map.extend('ClientAvatarPickerVm', {
  define: {
    hair: {
      type: Hair,
      value: Hair.defaultValue
    },

    skin: {
      type: Skin,
      value: Skin.defaultValue
    },

    gender: {
      type: Gender,
      value: Gender.defaultValue
    },

    isOld: {
      type: 'boolean',
      value: false
    },

    hasWheelchair: {
      type: 'boolean',
      value: false
    },

    avatars: {
      get () {
        const hair = this.attr('hair')
        const skin = this.attr('skin')
        const gender = this.attr('gender')
        const isOld = this.attr('isOld')
        const hasWheelchair = this.attr('hasWheelchair')
        return baseAvatars.map((avatar, index) => Object.assign(
          {},
          avatar,
          {index,
            hair,
            skin,
            isSelected: (
              avatar.gender === gender &&
            avatar.isOld === isOld &&
            avatar.hasWheelchair === hasWheelchair
            )}
        ))
      }
    },

    femaleAvatars: {
      get () {
        return this
          .attr('avatars')
          .filter(avatar => avatar.gender === 'female')
      }
    },

    maleAvatars: {
      get () {
        return this
          .attr('avatars')
          .filter(avatar => avatar.gender === 'male')
      }
    }
  },

  fireAvatar (index) {
    const handleAvatar = this.attr('onAvatar')
    if (handleAvatar) {
      const avatar = baseAvatars[index]
      handleAvatar(avatar)
    }
  }
})

/**
 * @module {function} components/client-avatar-picker/ <client-avatar-picker>
 * @parent api-components
 * @signature `<client-avatar-picker>`
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'client-avatar-picker',
  viewModel: ClientAvatarPickerVm
})

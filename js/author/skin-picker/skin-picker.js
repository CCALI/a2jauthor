import CanMap from 'can-map'
import Component from 'can-component'
import template from './skin-picker.stache'
import {
  skinTones,
  getClassNameForSkin
} from 'caja/viewer/desktop/avatar/colors'

const skinClasses = skinTones.map(getClassNameForSkin)

export const SkinPickerVm = CanMap.extend({
  define: {
    selectedSkinClass: {
      get () {
        const skin = this.attr('selectedSkin')
        const classes = this.attr('skinClasses')
        const skinIndex = skinTones.indexOf(skin)
        const skinClass = classes[skinIndex]
        return skinClass
      }
    },

    skinClasses: {value: () => skinClasses}
  },

  onSkinClass (skinClass) {
    const handler = this.attr('onSkin')
    if (handler) {
      const classes = this.attr('skinClasses')
      const skinIndex = classes.indexOf(skinClass)
      const skin = skinTones[skinIndex]
      handler(skin)
    }
  }
})

export default Component.extend({
  tag: 'skin-picker',
  view: template,
  leakScope: false,
  viewModel: SkinPickerVm
})

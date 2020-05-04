import CanMap from 'can-map'
import Component from 'can-component'
import template from './hair-picker.stache'
import 'can-map-define'

import {
  hairColors,
  getClassNameForHair
} from 'caja/viewer/desktop/avatar/colors'

const hairClasses = hairColors.map(hair => {
  const hairClass = getClassNameForHair(hair)
  return hair !== 'bald' ? hairClass : `${hairClass} cross-through`
})

export const HairPickerVm = CanMap.extend({
  define: {
    selectedHairClass: {
      get () {
        const hair = this.attr('selectedHair')
        const classes = this.attr('hairClasses')
        const hairIndex = hairColors.indexOf(hair)
        const hairClass = classes[hairIndex]
        return hairClass
      }
    },

    hairClasses: { value: () => hairClasses }
  },

  onHairClass (hairClass) {
    const handler = this.attr('onHair')
    if (handler) {
      const classes = this.attr('hairClasses')
      const hairIndex = classes.indexOf(hairClass)
      const hair = hairColors[hairIndex]
      handler(hair)
    }
  }
})

export default Component.extend({
  tag: 'hair-picker',
  view: template,
  leakScope: false,
  ViewModel: HairPickerVm
})

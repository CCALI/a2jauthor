import CanMap from 'can-map'
import Component from 'can-component'
import template from './color-chips.stache'

import 'can-map-define'

export const ColorChipsVm = CanMap.extend('ColorChipsVm', {
  define: {
    colorClasses: {
      value () {
        return []
      }
    },
    selectedColorClass: {
      value () {
        return null
      }
    },
    onColorClass: {
      value () {
        return null
      }
    }
  },

  onSelect (color) {
    const handler = this.attr('onColorClass')
    if (handler) {
      return () => handler(color)
    }
  }
})

/**
 * @module {function} components/color-chips/ <color-chips>
 * @parent api-components
 * @signature `<color-chips>`
 *
 * Thin wrapper to create the button toolbar components below the header of each
 * page. It just enforces the style and has no functionality by itself.
 */
export default Component.extend({
  view: template,
  ViewModel: ColorChipsVm,
  leakScope: false,
  tag: 'color-chips'
})

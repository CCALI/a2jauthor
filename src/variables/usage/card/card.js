import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './card.stache'

export const UsageCardVM = DefineMap.extend('UsageCardVM', {
  // passed in from parent
  cardInfo: {},

  isOpen: { default: true },

  toggleDetails (el, ev) {
    ev && ev.preventDefault()
    ev && ev.stopPropagation()
    const detailsEl = el.nodeName === 'DETAILS' ? el : el.nextElementSibling

    if (this.isOpen) {
      this.isOpen = false
      detailsEl.removeAttribute('open')
    } else {
      this.isOpen = true
      detailsEl.setAttribute('open', '')
    }
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: UsageCardVM,
  tag: 'usage-card'
})

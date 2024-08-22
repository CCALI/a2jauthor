import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './guide-health.stache'

export const GuideHealthVM = DefineMap.extend('GuideHealthVM', {
  message: {
    type: 'text',
    default: ''
  }
})

export default Component.extend({
  tag: 'guide-health',
  view: template,
  leakScope: false,
  ViewModel: GuideHealthVM
})

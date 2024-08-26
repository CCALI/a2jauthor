import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './health-message.stache'

export const HealthMessageVM = DefineMap.extend('HealthMessageVM', {
  message: {
    type: 'text',
    default: ''
  }
})

export default Component.extend({
  tag: 'health-message',
  view: template,
  leakScope: false,
  ViewModel: HealthMessageVM
})

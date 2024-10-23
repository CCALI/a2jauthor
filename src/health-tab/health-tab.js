import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './health-tab.stache'

export const HealthTabVM = DefineMap.extend('HealthTabVM', {
  // passed in via app.stache
  guide: {set (guide) {
    console.log('g', guide)
    return guide
  }},
  guideId: {},
  waiting: {
    type: 'boolean',
    default: false
  },
})

export default Component.extend({
  tag: 'health-tab',
  view: template,
  leakScope: false,
  ViewModel: HealthTabVM
})

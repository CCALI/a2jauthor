import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './feedback.stache'

export const AboutFeedbackVM = DefineMap.extend('AboutFeedbackVM', {
  // passed in via about.stache
  guide: {}
})

export default Component.extend({
  tag: 'about-feedback',
  view: template,
  leakScope: false,
  ViewModel: AboutFeedbackVM
})

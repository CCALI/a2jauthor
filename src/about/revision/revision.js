import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './revision.stache'

export const AboutRevisionVM = DefineMap.extend('AboutRevisionVM', {
  // passed in via about.stache
  guide: {}
})

export default Component.extend({
  tag: 'about-revision',
  view: template,
  leakScope: false,
  ViewModel: AboutRevisionVM
})

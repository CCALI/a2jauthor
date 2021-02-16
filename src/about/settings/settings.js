import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './settings.stache'

export const AboutSettingsVM = DefineMap.extend('AboutSettingsVM', {
  gPrefs: {},

  connectedCallback () {
    this.gPrefs.load()
  }
})

export default Component.extend({
  tag: 'about-settings',
  view: template,
  leakScope: false,
  ViewModel: AboutSettingsVM
})

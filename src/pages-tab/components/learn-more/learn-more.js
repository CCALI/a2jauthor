// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './learn-more.stache'

export const LearnMoreVM = DefineMap.extend('LearnMoreVM', {
  page: {},
  appState: {},

  get legacySection () {
    return window.buildLearnMoreFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'learn-more',
  view: template,
  leakScope: false,
  ViewModel: LearnMoreVM
})

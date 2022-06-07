// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './learn-more.stache'
import { ckeFactory } from '../../helpers/helpers'

export const LearnMoreVM = DefineMap.extend('LearnMoreVM', {
  page: {},
  appState: {},
  guideFiles: {},

  ckeFactory,

  helpAltTextChangeHandler: function (el) {
    const val = el.value
      .replace(/[^\w\s]|_/g, '') // only allow letters, digits, and whitespace
      .replace(/\s+/g, ' ') // single spaces only
      .trim().substring(0, 120)
    this.page.helpAltText = val
    el.value = val
    return val
  },

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

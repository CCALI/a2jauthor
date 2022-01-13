import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './advanced-logic.stache'

export const AdvancedLogic = DefineMap.extend('AdvancedLogic', {
  page: {},
  appState: {},

  get legacySection () {
    return window.buildLogicFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'advanced-logic',
  view: template,
  leakScope: false,
  ViewModel: AdvancedLogic
})

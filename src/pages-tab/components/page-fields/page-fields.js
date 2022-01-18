// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './page-fields.stache'

export const PageFieldsVM = DefineMap.extend('PageFieldsVM', {
  page: {},
  appState: {},

  get legacySection () {
    return window.buildFieldsFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'page-fields',
  view: template,
  leakScope: false,
  ViewModel: PageFieldsVM
})

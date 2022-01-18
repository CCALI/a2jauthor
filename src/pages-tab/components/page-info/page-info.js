// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './page-info.stache'

export const PageInfoVM = DefineMap.extend('PageInfoVM', {
  page: {},
  appState: {},

  get legacySection () {
    return window.buildPageFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'page-info',
  view: template,
  leakScope: false,
  ViewModel: PageInfoVM
})

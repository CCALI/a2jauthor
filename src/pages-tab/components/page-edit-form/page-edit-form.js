// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './page-edit-form.stache'

export const PageEditFormVM = DefineMap.extend('PageEditFormVM', {
  appState: {},
  page: {},

  selectedTab: { default: 'Page Info' },

  toggleTabs () {
    this.appState.modalTabView = !this.appState.modalTabView
  },

  connectedCallback () {
    // TOOD: obviously terrible, need more time to complete the upgrade fully
    // sets "appState" and "page" on our viewModel
    Object.assign(this, window.canjs_LegacyModalPageEditFormInjection)
  }
})

export default Component.extend({
  tag: 'page-edit-form',
  view: template,
  leakScope: false,
  ViewModel: PageEditFormVM
  // , events: {
  //   '* focus': function (target) {
  //     console.log(arguments)
  //   }
  // }
})

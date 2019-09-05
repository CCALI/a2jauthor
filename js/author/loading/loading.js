import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './loading.stache'

export const LoadingVM = DefineMap.extend('LoadingVM', {
  loadingMessage: {
    default: 'Loading ...'
  }
})

export default Component.extend({
  ViewModel: LoadingVM,
  view: template,
  tag: 'app-loading',
  leakScope: true
})

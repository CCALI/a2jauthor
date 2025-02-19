import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './usage.stache'

export const VariableUsageVM = DefineMap.extend('VariableUsageVM', {
  // passed in from editor.stache
  initialVarName: {},

  varUsageList: {},

  openQDE (pageName) {
    console.log('open page', pageName)
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: VariableUsageVM,
  tag: 'variable-usage'
})

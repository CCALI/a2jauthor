import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './var-picker.stache'

export const VarPicker = DefineMap.extend('VarPicker', {
  page: {},
  appState: {},

  selectedCallback: {},

  varName: {
    type: 'text',
    default: ''
  },

  get guide () {
    return this.appState && this.appState.guide
  },

  // list of var objects
  get vars () {
    const vars = this.guide && this.guide.vars
    const varNames = Object.keys(vars || {})
    return new DefineList(varNames.map(n => vars[n]))
  },

  get matchedVars () {
    return this.vars.filter(v => v.name.toLowerCase().indexOf(this.varName.toLowerCase()) !== -1)
  },

  get unmatchedVars () {
    return this.vars.filter(v => v.name.toLowerCase().indexOf(this.varName.toLowerCase()) === -1)
  },

  onSelected (value) {
    this.varName = value
    const cb = this.selectedCallback
    if (typeof cb === 'function') {
      cb(value)
    }
  }
})

export default Component.extend({
  tag: 'var-picker',
  view: template,
  leakScope: false,
  ViewModel: VarPicker
})

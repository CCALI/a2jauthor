import $ from 'jquery'
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

// from A2J_Tabs.js
// Pick variable name from list of defined variables
const varPicker = function (data) {
  var dval = (data.value)
  var label = data.label ? '<label class="control-label">' + data.label + '</label>' : ''
  var variable = data.label === 'Variable:'? 'variable' : ''
  var $el = $(
    '<div class="div'+ variable + '"' + (data.name ? 'name="' + data.name + '"' : '') + '>' +
    label +
    '<div class="editspan form-group">' +
      '<input class="form-control ui-combobox-input editable autocomplete picker varname dest ' + variable + '" placeholder="' + data.placeholder + '" type="text" >' +
    '</div>' +
    '</div>'
  )

  var $pickerInput = $el.find('.picker.autocomplete')

  var onBlur = function () {
    var val = $(this).val()
    form.change($(this), val)
  }

  // Create list of sorted variable names with type info.
  var sortedVars = gGuide.varsSorted()

  var source = sortedVars.map(function (variable) {
    return {
      value: variable.name,
      label: variable.name + ' ' + variable.type
    }
  })

  $pickerInput
    .blur(onBlur)
    .data('data', data)
    .val(decodeEntities(dval))

  $pickerInput.autocomplete({
    source: source,
    appendTo: '.page-edit-form-panel',
    change: function () {
      var newvalue = $(this).val()
      $(this).val(newvalue)
    }
  })
    .focus(function () {
      $(this).autocomplete('search')
    })

  return $el
}

import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './var-picker-field.stache'
import { TVariable } from '~/legacy/viewer/A2J_Types'
import { onlyOne } from '../../../helpers/helpers'

export const VarPickerField = DefineMap.extend('VarPickerField', {
  page: {},
  appState: {},
  // obj[key] like button['name']
  obj: {
    type: 'any'
  },
  key: {
    type: 'text',
    default: ''
  },
  label: {
    type: 'text',
    default: 'Variable Name:'
  },
  filterText: { // ObservableProxy
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.obj[this.key] = val
        resolve(val)
      })
      resolve(this.obj[this.key])
    }
  },
  placeholder: {
    type: 'text',
    default: ''
  },

  newObservableBool (tf = false) {
    return new DefineMap({ value: tf })
  },
  onlyOne (observableBool) {
    if (onlyOne.observableBoolAtATime && observableBool !== onlyOne.observableBoolAtATime) {
      onlyOne.observableBoolAtATime.value = false
    }
    onlyOne.observableBoolAtATime = observableBool
  },
  toggleBool (observableBool) {
    this.onlyOne(observableBool)
    observableBool.value = !observableBool.value
  },
  makeTrue (observableBool) {
    this.onlyOne(observableBool)
    observableBool.value = true
  },

  validVarName (newValue) {
    return (!newValue) || (!!this.appState.guide.vars[newValue.toLowerCase()])
  },

  makeTrueAndFocusPopup (bool) {
    this.makeTrue(bool)
    setTimeout(() => {
      const el = document.querySelector('variable-editor [name="varname"]')
      el && el.focus()
    }, 100)
  },

  newVarData: {},

  onVariableChange (variable) {
    this.newVarData = variable
  },

  makeFalseAndClearDataCB (bool) {
    return () => {
      bool.value = false
      this.newVarData = undefined
    }
  },

  addVarCB (bool) {
    return () => {
      const variable = this.newVarData
      const name = variable && variable.name
      if (name) {
        const v = new TVariable()
        Object.assign(v, variable)
        this.appState.guide.vars.assign({ [name.toLowerCase()]: v })
        this.filterText = ''
        this.filterText = name
        if (window.gGuide && window.gGuide.varCreate) {
          window.gGuide.varCreate(name, v.type, v.repeating, v.comment)
        }
      }
      bool.value = false
      this.newVarData = undefined
    }
  },

  focusFirstButtonInList (ev) {
    (ev.keyCode === 40) && ev.target.parentNode.querySelector('ul button').focus() // down arrow key
  }
})

export default Component.extend({
  tag: 'var-picker-field',
  view: template,
  leakScope: false,
  ViewModel: VarPickerField
})

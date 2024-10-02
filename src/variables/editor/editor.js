import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './editor.stache'
import constants from '~/src/models/constants'

export const VariableEditorVM = DefineMap.extend('VariableEditorVM', {
  /*
      type Variable = {
        name: String,
        type: String,
        comment: String,
        repeating: Boolean
      }

      initialVariable: Maybe Variable
      existingVariableNames: List String
      showUsageFinder: Boolean
      onSelectSuggestion: Function String
      onVariableChange: Function Variable
    */

  initialVariable: {
    set (initialVariable) {
      const variable = initialVariable || {}
      this.variableName = variable.name
      this.variableType = variable.type
      this.variableComment = variable.comment
      this.variableIsRepeating = variable.repeating
      return initialVariable
    }
  },

  variableNameMaxLength: {
    get () {
      if (!window.gPrefs || !window.gPrefs.warnHotDocsNameLength) {
        return false
      }

      return constants.MAXVARNAMELENGTH
    }
  },

  variableName: {
    default: '',
    set (x = '') {
      this.emitVariable()
      return x
    }
  },
  variableType: {
    default: 'Text',
    set (x = 'Text') {
      this.emitVariable()
      return x
    }
  },
  variableComment: {
    default: '',
    set (x = '') {
      this.emitVariable()
      return x
    }
  },
  variableIsRepeating: {
    default: false,
    set (x = false) {
      this.emitVariable()
      return x
    }
  },

  variableUsageHtml: {},

  existingVariableNames: {},

  variableSuggestions: {
    get () {
      const initialVariable = this.initialVariable
      const hasWorkingVariable = !!initialVariable
      if (hasWorkingVariable) {
        return []
      }

      const text = this.variableName.toLowerCase()
      if (!text) {
        return []
      }

      const names = this.existingVariableNames
      if (!names) {
        return []
      }

      const maxSuggestionCount = 5
      return names
        .serialize()
        .filter(name => {
          const containsText = name.toLowerCase().indexOf(text) !== -1
          return containsText
        })
        .sort((a, b) => a.localeCompare(b))
        .slice(0, maxSuggestionCount)
    }
  },

  // the variable name as it was before the editor was opened, or whatever it is now if its a new variable
  initialVarName: {
    get () {
      const iv = this.initialVariable
      const ivname = iv && iv.name // use the initially loaded name in case they've edited it in the form before checking usage
      const variableName = ivname || this.variableName
      return variableName
    }
  },

  emitVariable () {
    if (this._willEmit) {
      return
    }

    this._willEmit = true
    setTimeout(() => {
      this._willEmit = false

      const onVariableChange = this.onVariableChange
      if (!onVariableChange) {
        return
      }

      const variable = {
        name: this.variableName,
        type: this.variableType,
        comment: this.variableComment,
        repeating: this.variableIsRepeating
      }

      onVariableChange(variable)
    }, 0)
  },

  onSuggestionSelect (name) {
    const onSelectSuggestion = this.onSelectSuggestion
    if (!onSelectSuggestion) {
      return
    }

    this.onSelectSuggestion(name)
  },

  onFindUsage () {
    // use the initially loaded name in case they've edited it in the form before checking usage
    const variableName = this.initialVarName
    const html = window.vcGatherUsage(variableName)
    this.variableUsageHtml = html
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: VariableEditorVM,
  tag: 'variable-editor',
  events: {
    '.findBtn click' (target, event) {
      event.preventDefault()
      this.viewModel.onFindUsage()
    },
    '.var-name input' (target, event) {
      this.viewModel.variableName = event.target.value
    }
  }
})

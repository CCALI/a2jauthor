import CanMap from 'can-map'
import Component from 'can-component'
import template from './editor.stache'
import constants from 'caja/viewer/models/constants'

export const VariableEditorVM = CanMap.extend({
  define: {
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
        this.attr('variableName', variable.name)
        this.attr('variableType', variable.type)
        this.attr('variableComment', variable.comment)
        this.attr('variableIsRepeating', variable.repeating)
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
      value: '',
      set (x = '') {
        this.emitVariable()
        return x
      }
    },
    variableType: {
      value: 'Text',
      set (x = 'Text') {
        this.emitVariable()
        return x
      }
    },
    variableComment: {
      value: '',
      set (x = '') {
        this.emitVariable()
        return x
      }
    },
    variableIsRepeating: {
      value: false,
      set (x = false) {
        this.emitVariable()
        return x
      }
    },

    variableUsageHtml: {},

    existingVariableNames: {},

    variableSuggestions: {
      get () {
        const initialVariable = this.attr('initialVariable')
        const hasWorkingVariable = !!initialVariable
        if (hasWorkingVariable) {
          return []
        }

        const text = this.attr('variableName').toLowerCase()
        if (!text) {
          return []
        }

        let names = this.attr('existingVariableNames')
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
    }
  },

  emitVariable () {
    if (this._willEmit) {
      return
    }

    this._willEmit = true
    setTimeout(() => {
      this._willEmit = false

      const onVariableChange = this.attr('onVariableChange')
      if (!onVariableChange) {
        return
      }

      const variable = {
        name: this.attr('variableName'),
        type: this.attr('variableType'),
        comment: this.attr('variableComment'),
        repeating: this.attr('variableIsRepeating')
      }

      onVariableChange(variable)
    }, 0)
  },

  onSuggestionSelect (name) {
    const onSelectSuggestion = this.attr('onSelectSuggestion')
    if (!onSelectSuggestion) {
      return
    }

    this.onSelectSuggestion(name)
  },

  onFindUsage () {
    const variableName = this.attr('variableName')
    const html = window.vcGatherUsage(variableName)
    this.attr('variableUsageHtml', html)
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
      this.viewModel.attr('variableName', event.target.value)
    }
  }
})

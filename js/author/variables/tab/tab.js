import $ from 'jquery'
import CanMap from 'can-map'
import Component from 'can-component'
import template from './tab.stache'
import parser from 'caja/viewer/mobile/util/parser'
import { promptFile } from 'caja/author/utils/uploader'
import queues from 'can-queues'

export const VariablesTabVM = CanMap.extend('VariablesTabVM', {
  define: {
    // passed in via js/author/app.stache
    guide: {},

    /* variables: List Variable */
    editingVariable: { value: null },
    showVariableModal: { value: false },
    variableBuffer: {},
    variableList: {
      get () {
        const guide = this.attr('guide')
        if (guide) {
          const vars = guide.attr('vars')
          if (vars) {
            const variables = []
            vars.forEach(value => variables.push(value))
            return variables.sort((a, b) =>
              (a.name || '').localeCompare(b.name || '')
            )
          }
        }
        return []
      }
    }
  },

  openVariableEditor (variableName) {
    const variableList = this.attr('variableList')
    const variable = variableList.filter(
      variable => variable.name === variableName
    )[0]

    this.attr('editingVariable', variable)
    this.attr('showVariableModal', true)
  },

  openVariableCreator () {
    this.attr('editingVariable', null)
    this.attr('showVariableModal', true)
  },

  onVariableChange (variableBuffer) {
    this.attr('variableBuffer', variableBuffer)
  },

  onSelectSuggestion (variableName) {
    const variableList = this.attr('variableList')
    const variable = variableList.filter(
      variable => variable.name === variableName
    )[0]

    this.attr('editingVariable', variable)
  },

  deleteVariable (name) {
    const guide = this.attr('guide')
    guide.vars.removeAttr(name.toLowerCase())
  },

  onDismissVariableEditing ({ usedCancelButton }) {
    this.attr('showVariableModal', false)

    // TODO: remove when checkbox delete is implemented
    const isDeleteAction = usedCancelButton
    if (isDeleteAction) {
      const { name } = this.attr('variableBuffer')
      if (name) {
        this.deleteVariable(name)
      }
    }
  },

  onConfirmVariableEditing () {
    this.attr('showVariableModal', false)
    const guide = this.attr('guide')
    const buffer = this.attr('variableBuffer')
    if (!buffer.name) {
      return
    }

    const editingVariable = this.attr('editingVariable')
    if (editingVariable) {
      this.deleteVariable(editingVariable.name)
    }

    const variable = new window.TVariable()
    $.extend(variable, buffer.serialize())
    guide.vars.attr(buffer.name.toLowerCase(), variable)
  },

  uploadCmpFile () {
    return promptFile(null, 'CMP')
      .then(file => {
        return new Promise((resolve, reject) => {
          const reader = new window.FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = error => reject(error)
          reader.readAsText(file)
        })
      })
      .then(text => {
        return parser.parseHotDocsXML(text)
      })
      .then(tuples => {
        this.addUploadedVariables(tuples)
      })
  },

  addUploadedVariables (cmpTuples) {
    const guide = this.attr('guide')
    queues.batch.start()
    if (guide && guide.vars) {
      cmpTuples.forEach(newVar => {
        // name, type, repeating, comment
        const variable = new window.TVariable()
        $.extend(variable, newVar)
        guide.vars.attr(newVar.name.toLowerCase(), variable)
      })
    }
    queues.batch.stop()
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: VariablesTabVM,
  tag: 'variables-tab'
})

import CanMap from 'can-map'
import _isString from 'lodash/isString'
import _capitalize from 'lodash/capitalize'
import createEmptyNode from 'a2jdeps/utils/create-empty-node'

import 'can-map-define'

/**
 * @module TemplateEditTabsVM
 * @parent TemplateEditTabs
 *
 * `<template-edit-tabs />` viewmodel
 */
export default CanMap.extend({
  define: {
    editingHeader: {
      type: 'boolean',
      value: false
    },

    editingFooter: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {can.Map} templateState
     *
     * State object of the root node template
     */
    templateState: {
      get () {
        return this.attr('template.rootNode.state')
      }
    },

    /**
     * @property {Boolean} isConditionalLogicEnabled
     *
     * Whether the conditional logic form is enabled
     */
    isConditionalLogicEnabled: {
      get () {
        const templateState = this.attr('templateState')

        if (templateState) {
          const value = templateState.attr('hasConditionalLogic')
          return _isString(value) ? value === 'true' : Boolean(value)
        }

        // default value
        return false
      },

      set (newVal) {
        const templateState = this.attr('templateState')

        if (templateState) templateState.attr('hasConditionalLogic', newVal)
        return newVal
      }
    }
  },

  addElement (elementName) {
    const template = this.attr('template')
    const newNode = createEmptyNode(elementName)

    template.addNode(newNode)
  },

  editElement (elementName) {
    this.attr('editing' + _capitalize(elementName), true)
  }
})

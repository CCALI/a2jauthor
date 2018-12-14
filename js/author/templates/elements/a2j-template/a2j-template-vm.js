import CanMap from 'can-map'
import _omit from 'lodash/omit'
import _inRange from 'lodash/inRange'
import _isFunction from 'lodash/isFunction'
import A2JNode from 'caja/author/models/a2j-node'
import Answers from 'caja/author/models/answers'

import 'can-map-define'

const fontFamilyMap = {
  'sans-serif': '\'Open Sans\', sans-serif',
  arial: 'Arial, \'Helvetica Neue\', Helvetica, sans-serif',
  'times-new-roman': 'TimesNewRoman, \'Times New Roman\', Times, Baskerville, Georgia, serif',
  'courier-new': '\'Courier New\', Courier, \'Lucida Sans Typewriter\', \'Lucida Typewriter\', monospace'
}

const moveItem = function (list, from, to) {
  let length = list.attr('length')

  from = parseInt(from, 10)
  to = parseInt(to, 10)

  if (_inRange(from, 0, length) && _inRange(to, 0, length)) {
    var item = list.splice(from, 1)[0]
    list.splice(to, 0, item)
    return list
  }
}

/**
 * @module {Module} author/templates/elements/a2j-template/ <a2j-template>
 * @parent api-components
 *
 * This is the root component of the document assembly process, it renders all
 * of the "elements" (nodes) of a "template".
 *
 * ## Use
 *
 * @codestart
 * <a2j-template edit-enabled="true" template="{a2jTemplate}"/>
 * @codeend
 */

/**
 * @property {can.Map} a2jTemplate.ViewModel
 * @parent author/templates/elements/a2j-template/
 *
 * `<a2j-template>`'s viewModel.
 */
export default CanMap.extend("A2JTemplateVM", {
  define: {
    // passed in
    leftOperand: {},
    leftOperandType: {},

    /**
     * @property {Answers} conditional.ViewModel.prototype.answers answers
     * @parent conditional.ViewModel
     *
     * Answers object available when user uploads an ANX file during document
     * assembly.
     */
    answers: {
      Type: Answers
    },

    /**
     * @property {A2JTemplate} a2jTemplate.ViewModel.prototype.template template
     * @parent a2jTemplate.ViewModel
     *
     * The [A2JTemplate] model instance retrieved from the server.
     */
    template: {
      value: null
    },

    /**
     * @property {A2JNode} a2jTemplate.ViewModel.prototype.rootNode rootNode
     * @parent a2jTemplate.ViewModel
     *
     * The root [A2JNode] instance of `template`.
     */
    rootNode: {
      get: function () {
        let template = this.attr('template')
        return template && template.attr('rootNode')
      }
    },

    /**
     * @property {Boolean} a2jTemplate.ViewModel.prototype.editEnabled editEnabled
     * @parent a2jTemplate.ViewModel
     *
     * Whether an element can have edit options made available.
     */
    editEnabled: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} a2jTemplate.ViewModel.prototype.useAnswers useAnswers
     * @parent a2jTemplate.ViewModel
     *
     * Whether to replace the variable names used in the template by their values
     * when user uploads an answer file.
     */
    useAnswers: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Function} a2jTemplate.ViewModel.prototype.saveCallback saveCallback
     * @parent a2jTemplate.ViewModel
     *
     * Callback to be executed when interactions to the element might require the
     * template to be updated.
     */
    saveCallback: {
      value: null
    },

    /**
     * @property {can.Map} a2jTemplate.ViewModel.prototype.selectedNode selectedNode
     * @parent a2jTemplate.ViewModel
     *
     * The currenly selected node (element) view model.
     */
    selectedNode: {
      get () {
        const rootNode = this.attr('rootNode')
        if (!rootNode) {
          return
        }

        const children = rootNode.attr('children')

        const active = children.filter(child => {
          return child.attr('state.editActive')
        })

        if (active && active.length) {
          return active.attr(0)
        }
      }
    },

    /**
     * @property {String} a2jTemplate.ViewModel.prototype.fontProperties fontProperties
     * @parent a2jTemplate.ViewModel
     *
     * Font CSS rules to be applied to the content of each element of the template.
     */
    fontProperties: {
      get () {
        const state = this.attr('rootNode.state')
        const size = state.attr('fontSize')
        const family = fontFamilyMap[state.attr('fontFamily')]

        if (family && size) {
          return `font-family: ${family}; font-size: ${size}px;`
        }
      }
    }
  },

  saveTemplateChanges () {
    let saveCallback = this.saveCallback

    if (_isFunction(saveCallback)) {
      saveCallback.call(this)
    } else {
      this.attr('template').save()
    }
  },

  getChildById (id) {
    const rootNode = this.attr('rootNode')
    const children = rootNode.attr('children')

    const find = (nodes, id) => {
      let result

      nodes.forEach(node => {
        const nodeIsATemplate = Boolean(node.attr('rootNode'))

        if (nodeIsATemplate) {
          const children = node.attr('rootNode.children')
          result = find(children)
          if (result) return false
        } else {
          if (node.attr('id') === id) {
            result = node
            return false
          } else {
            const children = node.attr('children')

            if (children.attr('length')) {
              result = find(children, id)
              if (result) return false
            }
          }
        }
      })

      return result
    }

    return find(children, id)
  },

  cloneNode (id) {
    const originalNode = this.getChildById(id)
    const children = this.attr('rootNode.children')

    // remove `id` before creating a cloned instance of the node, this will
    // prevent the cloned node to have the same `id` as the original.
    const clonedNode = new A2JNode(_omit(originalNode.attr(), 'id'))

    // the cloned node should be "selected" (ready to be edited)
    originalNode.attr('state').attr('editActive', false)
    clonedNode.attr('state').attr('editActive', true)

    // insert cloned node next to the original
    const clonedNodeIndex = children.indexOf(originalNode) + 1
    children.splice(clonedNodeIndex, 0, clonedNode)

    this.saveTemplateChanges()
  },

  restoreNode (id, event) {
    event && event.preventDefault()
    event && event.stopPropagation()

    const deletedNode = this.getChildById(id)

    deletedNode.attr('deleted', false)
    deletedNode.attr('state.deleted', false)
    deletedNode.attr('state.editActive', true)
  },

  // this function only flags the node as deleted, so we have time to display
  // the alert that allows user to restore the node right away.
  deleteNode (id) {
    let deletedNode = this.getChildById(id)

    deletedNode.attr('deleted', true)
    deletedNode.attr('state.deleted', true)
  },

  moveNode (id, indexModifier, currentNodeIndex) {
    const children = this.attr('rootNode.children')
    const from = currentNodeIndex
    const to = currentNodeIndex + indexModifier

    moveItem(children, from, to)
  },

  // this function "really" removes the node from the children array, hence
  // the `li` tag that contains the node is also removed from the DOM.
  removeNodeFromChildren (id) {
    const node = this.getChildById(id)
    const children = this.attr('rootNode.children')

    if (node && node.attr('deleted')) {
      const index = children.indexOf(node)

      children.splice(index, 1)
      this.saveTemplateChanges()
    }
  },

  updateNode (id) {
    const node = this.getChildById(id)

    // toggle editActive so it 'closes' the options pane
    node.attr('state.editActive', false)

    this.saveTemplateChanges()
  },

  toggleEditActiveNode (id) {
    const rootNode = this.attr('rootNode')
    const children = rootNode.attr('children')

    const toggle = (nodes, id) => {
      nodes.forEach(node => {
        let children
        const nodeId = node.attr('id')
        const isTemplate = !!node.attr('rootNode')

        if (isTemplate) {
          children = node.attr('rootNode.children')
        } else {
          children = node.attr('children')
          node.attr('state.editActive', (nodeId === id))
        }

        toggle(children, id)
      })
    }

    toggle(children, id)
  },

  updateChildrenOrder () {
    let from = this.attr('dragItemIndex')
    let to = this.attr('dropItemIndex')
    let children = this.attr('rootNode.children')

    if (from !== to) {
      moveItem(children, from, to)
      this.attr('dragItemIndex', to)
    }
  },

  setDragPlaceholderFlag () {
    let dragItemIndex = this.attr('dragItemIndex')
    if (dragItemIndex == null) return

    let children = this.attr('rootNode.children')
    let draggedItem = children.attr(dragItemIndex)

    if (typeof draggedItem !== 'undefined') {
      draggedItem.attr('isBeingDragged', true)
    }
  },

  removeDragPlaceholderFlag () {
    let dragItemIndex = this.attr('dragItemIndex')
    if (dragItemIndex == null) return

    let children = this.attr('rootNode.children')
    let draggedItem = children.attr(dragItemIndex)

    if (typeof draggedItem !== 'undefined') {
      draggedItem.attr('isBeingDragged', false)
    }
  }
})

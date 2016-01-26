import Map from 'can/map/';
import _inRange from 'lodash/inRange';
import _isFunction from 'lodash/isFunction';
import A2JNode from 'caja/author/models/a2j-node';
import A2JTemplate from 'caja/author/models/a2j-template';

import 'can/map/define/';

function moveItem(list, from, to) {
  let length = list.attr('length');

  from = parseInt(from, 10);
  to = parseInt(to, 10);

  if (_inRange(from, 0, length) && _inRange(to, 0, length)) {
    var item = list.splice(from, 1)[0];
    list.splice(to, 0, item);
    return list;
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
export default Map.extend({
  define: {
    /**
     * @property {A2JTemplate} a2jTemplate.ViewModel.prototype.define.template template
     * @parent a2jTemplate.ViewModel
     *
     * The [A2JTemplate] model instance retrieved from the server.
     */
    template: {
      value: null
    },

    /**
     * @property {A2JNode} a2jTemplate.ViewModel.prototype.define.rootNode rootNode
     * @parent a2jTemplate.ViewModel
     *
     * The root [A2JNode] instance of `template`.
     */
    rootNode: {
      get: function() {
        let template = this.attr('template');
        return template && template.attr('rootNode');
      }
    },

    /**
     * @property {Boolean} a2jTemplate.ViewModel.prototype.define.editEnabled editEnabled
     * @parent a2jTemplate.ViewModel
     *
     * Whether an element can have edit options made available.
     */
    editEnabled: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} a2jTemplate.ViewModel.prototype.define.useAnswers useAnswers
     * @parent a2jTemplate.ViewModel
     *
     * Whether to replace the variable names used in the template by their values
     * when user uploads an answer file.
     */
    useAnswers: {
      value: false
    },

    /**
     * @property {Function} a2jTemplate.ViewModel.prototype.define.saveCallback saveCallback
     * @parent a2jTemplate.ViewModel
     *
     * Callback to be executed when interactions to the element might require the
     * template to be updated.
     */
    saveCallback: {
      value: null
    },

    /**
     * @property {can.Map} a2jTemplate.ViewModel.prototype.define.selectedNode selectedNode
     * @parent a2jTemplate.ViewModel
     *
     * The currenly selected node (element) view model.
     */
    selectedNode: {
      get() {
        const rootNode = this.attr('rootNode');
        const children = rootNode.attr('children');

        const active = children.filter(child => {
          return child.attr('state.editActive');
        });

        if (active && active.length) {
          return active.attr(0);
        }
      }
    }
  },

  saveTemplateChanges() {
    let saveCallback = this.saveCallback;

    if (_isFunction(saveCallback)) {
      saveCallback.call(this);
    } else {
      this.attr('template').save();
    }
  },

  getChildById(id) {
    const rootNode = this.attr('rootNode');
    const children = rootNode.attr('children');

    const find = (nodes, id) => {
      let result;

      nodes.each(node => {
        if (node instanceof A2JTemplate) {
          const children = node.attr('rootNode.children');
          result = find(children);
          if (result) return false;
        } else {
          if (node.attr('id') === id) {
            result = node;
            return false;
          } else {
            const children = node.attr('children');

            if (children.attr('length')) {
              result = find(children, id);
              if (result) return false;
            }
          }
        }
      });

      return result;
    };

    return find(children, id);
  },

  cloneNode(id) {
    const originalNode = this.getChildById(id);
    const children = this.attr('rootNode.children');
    const clonedNode = new A2JNode(originalNode.attr());

    // the cloned node should be "selected" (ready to be edited)
    originalNode.attr('state').attr('editActive', false);
    clonedNode.attr('state').attr('editActive', true);

    // insert cloned node next to the original
    const clonedNodeIndex = children.indexOf(originalNode) + 1;
    children.splice(clonedNodeIndex, 0, clonedNode);

    this.saveTemplateChanges();
  },

  restoreNode(id) {
    const deletedNode = this.getChildById(id);

    deletedNode.attr('deleted', false);
    deletedNode.attr('state.deleted', false);
    deletedNode.attr('state.editActive', true);

    return false;
  },

  // this function only flags the node as deleted, so we have time to display
  // the alert that allows user to restore the node right away.
  deleteNode(id) {
    let deletedNode = this.getChildById(id);

    deletedNode.attr('deleted', true);
    deletedNode.attr('state.deleted', true);
  },

  // this function "really" removes the node from the children array, hence
  // the `li` tag that contains the node is also removed from the DOM.
  removeNodeFromChildren(id) {
    const node = this.getChildById(id);
    const children = this.attr('rootNode.children');

    if (node && node.attr('deleted')) {
      const index = children.indexOf(node);

      children.splice(index, 1);
      this.saveTemplateChanges();
    }
  },

  updateNode(id) {
    const node = this.getChildById(id);

    // toggle editActive so it 'closes' the options pane
    node.attr('state.editActive', false);

    this.saveTemplateChanges();
  },

  toggleEditActiveNode(id) {
    const rootNode = this.attr('rootNode');
    const children = rootNode.attr('children');

    const toggle = (nodes, id) => {
      nodes.each(node => {
        let children;
        const nodeId = node.attr('id');

        if (node instanceof A2JTemplate) {
          children = node.attr('rootNode.children');
        } else {
          children = node.attr('children');
          node.attr('state.editActive', (nodeId === id));
        }

        if (children.attr('length')) {
          toggle(children, id);
        }
      });
    };

    toggle(children, id);
  },

  updateChildrenOrder() {
    let from = this.attr('dragItemIndex');
    let to = this.attr('dropItemIndex');
    let children = this.attr('rootNode.children');

    if (from !== to) {
      moveItem(children, from, to);
      this.attr('dragItemIndex', to);
    }
  },

  setDragPlaceholderFlag() {
    let dragItemIndex = this.attr('dragItemIndex');
    if (dragItemIndex == null) return;

    let children = this.attr('rootNode.children');
    let draggedItem = children.attr(dragItemIndex);

    draggedItem.attr('isBeingDragged', true);
    draggedItem.attr('state').attr('editActive', true);
  },

  removeDragPlaceholderFlag() {
    let dragItemIndex = this.attr('dragItemIndex');
    if (dragItemIndex == null) return;

    let children = this.attr('rootNode.children');
    let draggedItem = children.attr(dragItemIndex);

    draggedItem.removeAttr('isBeingDragged');
  }
});

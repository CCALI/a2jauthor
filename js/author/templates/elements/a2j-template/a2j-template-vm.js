import Map from 'can/map/';
import List from 'can/list/';
import _omit from 'lodash/object/omit';
import _inRange from 'lodash/number/inRange';
import _isFunction from 'lodash/lang/isFunction';
import A2JNode from 'caja/author/models/a2j-node';

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
     * @property {can.List} a2jTemplate.ViewModel.prototype.define.nodesViewModels nodesViewModels
     * @parent a2jTemplate.ViewModel
     *
     * This is a list containing the instances of each of the `viewModels` of
     * the nodes of this `template`. We keep this list, in order to handle the
     * communication between the children nodes components and their root node
     * `<a2j-template>` component.
     */
    nodesViewModels: {
      value: function() {
        return new List();
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
        let nodesViewModels = this.attr('nodesViewModels');

        let active = nodesViewModels.filter(function(nodeVM) {
          return nodeVM.attr('editActive');
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

  cloneNode(nodeViewModel) {
    let index = this.getNodeViewModelIndex(nodeViewModel);

    if (index !== -1) {
      let rootNode = this.attr('rootNode');
      let children = rootNode.attr('children');

      let clonedNodeIndex = index + 1;
      let originalNode = children.attr(index);
      let clonedNode = new A2JNode(originalNode.attr());

      // the cloned node should be "selected" (ready to be edited)
      originalNode.attr('editActive', false);
      clonedNode.attr('state').attr('editActive', true);

      // insert cloned node below the original
      children.splice(clonedNodeIndex, 0, clonedNode);
      this.saveTemplateChanges();
    }
  },

  restoreNode(index) {
    index = index.isComputed ? index() : index;

    let rootNode = this.attr('rootNode');
    let nodesViewModels = this.attr('nodesViewModels');

    let nodeViewModel = nodesViewModels.attr(index);
    let deleteNode = rootNode.attr('children').attr(index);

    deleteNode.attr('deleted', false);
    nodeViewModel.attr('deleted', false);
    nodeViewModel.attr('editActive', true);

    return false;
  },

  // this function only flags the node as deleted, so we have time to display
  // the alert that allows user to restore the node right away.
  deleteNode(nodeViewModel) {
    let index = this.getNodeViewModelIndex(nodeViewModel);

    if (index !== -1) {
      let rootNode = this.attr('rootNode');
      let deletedNode = rootNode.attr('children').attr(index);

      deletedNode.attr('deleted', true);
      nodeViewModel.attr('deleted', true);
    }
  },

  // this function "really" removes the node from the children array, hence
  // the `li` tag that contains the node is also removed from the DOM.
  removeNodeFromChildren(index) {
    index = index.isComputed ? index() : index;

    let rootNode = this.attr('rootNode');
    let node = rootNode.attr('children').attr(index);

    if (node && node.attr('deleted')) {
      rootNode.attr('children').splice(index, 1);
      this.saveTemplateChanges();
    }
  },

  updateNodeState(nodeViewModel) {
    let index = this.getNodeViewModelIndex(nodeViewModel);

    if (index !== -1) {
      let node = this.attr('rootNode').attr('children').attr(index);

      // toggle editActive so it 'closes' the options pane
      nodeViewModel.attr('editActive', false);

      // `rootNodeScope` is a reference to `a2j-template` viewModel, if we
      // don't remove it before calling `.attr` in node's `state` map it
      // will cause a stack overflow.
      node.attr('state').attr(_omit(nodeViewModel.serialize(), 'rootNodeScope', 'guide'));

      this.saveTemplateChanges();
    }
  },

  toggleEditActiveNode(nodeViewModel) {
    let nodesViewModels = this.attr('nodesViewModels');

    nodesViewModels.each(function(node) {
      let isActive = node === nodeViewModel;
      node.attr('editActive', isActive);
    });

    this.toggleEditActiveNestedNode();
  },

  // walk the list of node's view model instances, if there is a node that
  // has nested nodes (it owns `a2j-template` instances) "tell it" to deselect
  // any possible active element that it might own.
  toggleEditActiveNestedNode() {
    let nodesViewModels = this.attr('nodesViewModels');

    nodesViewModels.each(function(node) {
      if (node.attr('hasNestedNodes')) {
        if (_isFunction(node.deselectNestedNode)) {
          node.deselectNestedNode();
        } else {
          console.error('Element is required to implement deselectNestedNode');
        }
      }
    });
  },

  getNodeViewModelIndex(nodeViewModel) {
    let index = -1;
    let nodesViewModels = this.attr('nodesViewModels');

    nodesViewModels.each(function(node, i) {
      if (node === nodeViewModel) {
        index = i;
        return false;
      }
    });

    return index;
  },

  registerNodeViewModel(nodeViewModel, index) {
    let nodesViewModels = this.attr('nodesViewModels');
    nodesViewModels.splice(index, 0, nodeViewModel);
  },

  deregisterNodeViewModel(nodeViewModel) {
    let nodesViewModels = this.attr('nodesViewModels');
    let index = this.getNodeViewModelIndex(nodeViewModel);

    if (index !== -1) {
      nodesViewModels.splice(index, 1);
    }
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

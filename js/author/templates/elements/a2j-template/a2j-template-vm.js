import Map from 'can/map/';
import List from 'can/list/';
import _omit from 'lodash/object/omit';
import _inRange from 'lodash/number/inRange';

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

export default Map.extend({
  define: {
    /**
     * @property {A2JTemplate} template
     */
    template: {
      value: ''
    },

    /**
     * @property {A2JNode} rootNode
     */
    rootNode: {
      get: function() {
        let template = this.attr('template');

        return template && template.attr('rootNode');
      }
    },

    nodesViewModels: {
      value: new List()
    },

    /**
     * @property {Boolean} editEnabled
     *
     * Whether an element can have edit options made available.
     */
    editEnabled: {
      value: false
    },

    showUpdateSuccess: {
      value: false
    }
  },

  saveTemplateChanges() {
    this.attr('template').save().then(() => {
      this.attr('showUpdateSuccess', true);
    });
  },

  cloneNode(nodeViewModel) {
    let index = this.getNodeViewModelIndex(nodeViewModel);

    if (index !== -1) {
      let rootNode = this.attr('rootNode');
      let children = rootNode.attr('children');

      let clonedNodeIndex = index + 1;
      let originalNode = children.attr(index);
      let clonedNode = new Map(originalNode.attr());

      // make sure cloned node is not in editable mode.
      clonedNode.attr('state').attr('editActive', false);

      // insert cloned node below the original
      children.splice(clonedNodeIndex, 0, clonedNode);
      this.saveTemplateChanges();
    }
  },

  deleteNode(nodeViewModel) {
    let index = this.getNodeViewModelIndex(nodeViewModel);

    if (index !== -1) {
      let rootNode = this.attr('rootNode');

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
      node.attr('state').attr(_omit(nodeViewModel.attr(), 'rootNodeScope'));

      this.saveTemplateChanges();
    }
  },

  toggleEditActiveNode(nodeViewModel) {
    let nodesViewModels = this.attr('nodesViewModels');

    nodesViewModels.each(function(node) {
      let active = node === nodeViewModel;
      node.attr('editActive', active);
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
    let nodesViewModels = this.attr('nodesViewModels');

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

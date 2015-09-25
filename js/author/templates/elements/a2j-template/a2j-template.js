import Map from 'can/map/';
import List from 'can/list/';
import stache from 'can/view/stache/';
import _omit from 'lodash/object/omit';
import Component from 'can/component/';
import dragula from 'dragula/dist/dragula';
import template from './a2j-template.stache!';

import 'author/alert/';
import 'can/map/define/';
import './a2j-template.less!';
import 'dragula/dist/dragula.css!';
import 'author/templates/elements/free-form/';
import 'author/templates/elements/a2j-variable/';
import 'author/templates/elements/section-title/';

export let A2JTemplateVM = Map.extend({
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
      let originalNode = rootNode.attr('children').attr(index);
      let clonedNode = new Map(originalNode.attr());

      rootNode.attr('children').push(clonedNode);
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

  registerNodeViewModel(nodeViewModel) {
    this.attr('nodesViewModels').push(nodeViewModel);
  },

  deregisterNodeViewModel(nodeViewModel) {
    let nodesViewModels = this.attr('nodesViewModels');
    let index = this.getNodeViewModelIndex(nodeViewModel);

    if (index !== -1) {
      nodesViewModels.splice(index, 1);
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-template',
  viewModel: A2JTemplateVM,

  events: {
    inserted($el) {
      // add drag & drop support to the templates view
      dragula([$el.get(0)]);
    }
  },

  helpers: {
    a2jParse(component, state) {
      component = component.isComputed ? component() : component;
      state = state.isComputed ?  state() : state;

      state.attr('editEnabled', this.attr('editEnabled'));

      return stache(component)(state);
    }
  }
});

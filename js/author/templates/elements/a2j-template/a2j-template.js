import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import stache from 'can/view/stache/';
import dragula from 'dragula/dist/dragula';
import template from './a2j-template.stache!';

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
    let index;
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
    },

    'element-toolbar .delete-element click': function($el, evt) {
      evt.preventDefault();

      let rootNode = this.viewModel.attr('rootNode');
      let nodeIndex = $el.parents('.node-wrapper').data('node-index');

      rootNode.attr('children').splice(nodeIndex, 1);
    },

    'element-toolbar .duplicate-element click': function($el, evt) {
      evt.preventDefault();

      let rootNode = this.viewModel.attr('rootNode');
      let nodeIndex = $el.parents('.node-wrapper').data('node-index');
      let originalNode = rootNode.attr('children').attr(nodeIndex);
      let clonedNode = new Map(originalNode.attr());

      rootNode.attr('children').push(clonedNode);
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

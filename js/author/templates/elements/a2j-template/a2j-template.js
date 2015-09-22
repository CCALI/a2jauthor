import Map from 'can/map/';
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

        return template.attr('rootNode');
      }
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
      state = state.isComputed ?  state() : state;
      component = component.isComputed ? component() : component;

      return stache(component)(state);
    }
  }
});

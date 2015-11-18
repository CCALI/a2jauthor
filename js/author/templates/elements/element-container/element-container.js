import Map from 'can/map/';
import Component from 'can/component/';
import template from './element-container.stache!';

import 'can/map/define/';

/**
 * @module {Module} author/templates/elements/element-container/ <element-container>
 * @parent api-components
 *
 * This is the base component for the "elements" that belong to a given template,
 * it takes care of displaying the element's toolbar and handling the common
 * states: default, hovered and selected.
 *
 * ## Use
 *
 * @codestart
 * <element-container>
 *   <h2>Section Title</h2>
 * </element-container>
 * @codeend
 */

/**
 * @property {can.Map} element-container.ViewModel
 * @parent author/templates/elements/element-container/
 *
 * `<element-container>`'s viewModel.
 */
export let Container = Map.extend({
  define: {
    /**
     * @property {Boolean} element-container.ViewModel.prototype.define.selected selected
     * @parent element-container.ViewModel
     *
     * Whether this element is selected.
     */
    selected: {
      value: false
    }
  },

  /**
   * @property {function} element-container.ViewModel.prototype.setSelected setSelected
   * @parent element-container.ViewModel
   *
   * Sets `selected` property to `true`
   */
  setSelected() {
    this.attr('selected', true);
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'element-container',

  viewModel: function(attrs, parentScope) {
    let vm = new Container(attrs);
    vm.attr('parentScope', parentScope.attr('.'));
    return vm;
  },

  events: {
    inserted($el) {
      let vm = this.viewModel.attr('parentScope');
      let $a2jTemplate = $el.parents('a2j-template');

      // only register element if it is a child of `a2j-template`
      if ($a2jTemplate.length) {
        let rootNodeScope = $a2jTemplate.viewModel();

        // get node's index value from the list item wrapper element
        let $listItem = $el.parents('.node-wrapper');
        let nodeIndex = $listItem.data('node-index');

        vm.attr('rootNodeScope', rootNodeScope);
        rootNodeScope.registerNodeViewModel(vm, nodeIndex);

        this.toggleEditActiveNode();
      }
    },

    removed() {
      let vm = this.viewModel.attr('parentScope');
      let rootNodeScope = vm.attr('rootNodeScope');

      if (rootNodeScope) {
        rootNodeScope.deregisterNodeViewModel(vm);
      }
    },

    '{viewModel} selected': function() {
      this.toggleEditActiveNode();
    },

    toggleEditActiveNode() {
      let vm = this.viewModel.attr('parentScope');
      let editActive = vm.attr('editActive');
      let rootNodeScope = vm.attr('rootNodeScope');

      if (editActive && rootNodeScope) {
        rootNodeScope.toggleEditActiveNode(vm);
      }
    }
  }
});

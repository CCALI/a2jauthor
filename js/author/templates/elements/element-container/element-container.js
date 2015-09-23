import Map from 'can/map/';
import Component from 'can/component/';
import template from './element-container.stache!';

import 'can/map/define/';
import '../element-toolbar/';
import './element-container.less!';

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
   * @property {function} element-container.ViewModel.prototype.toggleSelected toggleSelected
   * @parent element-container.ViewModel
   *
   * Toggles `selected` value.
   */
  toggleSelected() {
    let selected = this.attr('selected');
    this.attr('selected', !selected);
  }
});

export default Component.extend({
  tag: 'element-container',
  template,
  leakScope: false,
  viewModel: function(attrs, parentScope) {
    let vm = new Container();

    vm.attr('parentScope', parentScope.attr('.'));

    return vm;
  },
  events: {
    inserted($el) {
      let vm = this.viewModel.attr('parentScope');
      let rootViewModel = $el.parents('a2j-template').viewModel();

      vm.attr('rootViewModel', rootViewModel);
      rootViewModel.registerNodeViewModel(vm);
    },

    removed() {
      let vm = this.viewModel.attr('parentScope');
      let rootViewModel = vm.attr('rootViewModel');

      if (rootViewModel) {
        rootViewModel.deregisterNodeViewModel(vm);
      }
    },

    '{viewModel} selected': function() {
      let vm = this.viewModel.attr('parentScope');
      let editActive = vm.attr('editActive');
      let rootViewModel = vm.attr('rootViewModel');

      if(editActive) {
        rootViewModel.toggleEditActiveNode(vm);
      }
    }
  }
});

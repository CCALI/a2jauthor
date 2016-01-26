import Map from 'can/map/';
import Component from 'can/component/';
import _isFunction from 'lodash/isFunction';
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
export let ContainerVM = Map.extend({
  define: {
    /**
     * @property {Boolean} element-container.ViewModel.prototype.selected selected
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
    const selected = this.attr('selected');

    if (!selected) {
      const id = this.attr('nodeId');
      const toggleEditActiveNode = this.attr('toggleEditActiveNode');

      this.attr('selected', true);

      if (_isFunction(toggleEditActiveNode)) {
        toggleEditActiveNode(id);
      } else {
        console.error('toggleEditActiveNode should be a function');
      }
    }
  }
});

export default Component.extend({
  template,
  viewModel: ContainerVM,
  tag: 'element-container',

  events: {
    '{viewModel} deleted': function(ps, evt, deleted) {
      let $el = this.element;

      if (deleted) {
        $el.slideUp('fast');
        $el.siblings('element-options-pane').hide();
      } else {
        $el.slideDown('fast');
        $el.siblings('element-options-pane').show();
      }
    }
  }
});

import Map from 'can/map/';
import Component from 'can/component/';
import _isFunction from 'lodash/isFunction';
import template from './options-pane.stache!';

import 'can/map/define/';

/**
 * @module {Module} optionsPane <element-options-pane>
 * @parent api-components
 *
 * This is the base component for the element settings/options pane opened
 * during "edit mode". This component allows the user to save the changes made
 * to the element, and also to "close" the pane.
 *
 * ## Use
 *
 * @codestart
 * <element-options-pane title="My Element Settings">
 * </element-options-pane>
 * @codeend
 */

/**
 * @property {can.Map} optionsPane.ViewModel
 * @parent optionsPane
 *
 * `<element-options-pane>`'s viewModel.
 */
export let OptionsPane = Map.extend({
  define: {
    /**
     * @property {Boolean} optionsPane.ViewModel.prototype.define.title title
     * @parent optionsPane.ViewModel
     *
     * This is the title of the element options pane, it's rendered at the top,
     * to the left of the close button.
     */
    title: {
      type: 'string',
      value: ''
    },

    /**
     * @property {Boolean} optionsPane.ViewModel.prototype.define.showSaveButton showSaveButton
     * @parent optionsPane.ViewModel
     *
     * Whether to show the `Save and Close` button.
     */
    showSaveButton: {
      type: 'boolean',
      value: true
    }
  },

  /**
   * @property {function} optionsPane.ViewModel.prototype.saveAndClose saveAndClose
   * @parent optionsPane.ViewModel
   *
   * This method is called when the save & close button is clicked, it delegates
   * the logic to persist the element/node state to the `a2j-template` scope.
   */
  saveAndClose() {
    let saveAndClose = this.attr('saveAndClose');

    if (_isFunction(saveAndClose)) {
      saveAndClose();
    } else {
      // we need to refactor this component so it always gets this behavior as
      // a regular `attr` instead of keeping a reference to its parent VM.
      let nodeScope = this.attr('parentScope');

      if (nodeScope) {
        let rootNodeScope = nodeScope.attr('rootNodeScope');
        rootNodeScope.updateNodeState(nodeScope);
      }
    }

    return false;
  }
});

export default Component.extend({
  template,
  tag: 'element-options-pane',

  viewModel: function(attrs, parentScope) {
    let vm = new OptionsPane(attrs);
    vm.attr('parentScope', parentScope.attr('.'));
    return vm;
  }
});

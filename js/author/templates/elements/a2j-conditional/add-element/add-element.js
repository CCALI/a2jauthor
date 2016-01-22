import Map from 'can/map/';
import Component from 'can/component/';
import template from './add-element.stache!';
import _isFunction from 'lodash/lang/isFunction';
import createEmptyNode from 'caja/author/utils/create-empty-node';

import 'can/map/define/';

/**
 * @module {Module} author/templates/elements/a2j-conditional/add-element/ <conditional-add-element>
 * @parent api-components
 *
 * This component allows the user to add elements like `a2j-section-title` or
 * `a2j-rich-text` to either the body of the `if` block in `a2j-conditional` or
 * to the body of the `else` block.
 *
 * ## Use
 *
 * @codestart
 *   <conditional-add-element {(template)}="ifBody" />
 * @codeend
 */

/**
 * @property {can.Map} addElement.ViewModel
 * @parent author/templates/elements/a2j-conditional/add-element/
 *
 * `<conditional-add-element>`'s viewModel.
 */
const AddElementVM = Map.extend({
  define: {
    /**
     * @property {Boolean} addElement.ViewModel.prototype.editActive editActive
     * @parent addElement.ViewModel
     *
     * Whether the component is currently selected.
     */
    editActive: {
      type: 'boolean',
      value: false
    }
  },

  /**
   * @function addElement.ViewModel.prototype.select select
   * @parent addElement.ViewModel
   *
   * This function is executed when the user clicks the element, this sets
   * `editActive` to `true` which causes the `element-options-pane` to be shown
   * allowing the user to effectively add elements.
   */
  select() {
    let setSelectedNode = this.attr('setSelectedNode');

    if (_isFunction(setSelectedNode)) {
      setSelectedNode(this);
    }

    return false;
  },

  /**
   * @function addElement.ViewModel.prototype.closeOptionsPopup closeOptionsPopup
   * @parent addElement.ViewModel
   *
   * Callback function passed down to `element-options-pane`, it is called when
   * the pane is about to be closed.
   */
  closeOptionsPopup() {
    this.attr('editActive', false);
    this.attr('activeNode', null);
  },

  /**
   * @function addElement.ViewModel.prototype.addElement addElement
   * @parent addElement.ViewModel
   *
   * Adds the element matching `tagName` to the available `template` object.
   */
  addElement(tagName) {
    let template = this.attr('template');
    template.addNode(createEmptyNode(tagName));
    return false;
  }
});

export default Component.extend({
  template,
  viewModel: AddElementVM,
  tag: 'conditional-add-element'
});

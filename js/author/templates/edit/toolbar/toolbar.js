import Map from 'can/map/';
import Component from 'can/component/';
import template from './toolbar.stache!';

import 'can/map/define/';

/**
 * @module {Module} author/templates/edit/toolbar/toolbar <template-edit-toolbar>
 * @parent api-components
 *
 * This component is rendered below the header in the template edit page,
 * it provides an input to edit the template's title and other options, like the
 * test assemble button to generate a pdf.
 *
 * ## Use
 *
 * @codestart
 *   <template-edit-toolbar template="{a2jTemplate}" />
 * @codeend
 */

/**
 * @property {can.Map} editToolbar.ViewModel
 * @parent author/templates/edit/toolbar/toolbar
 *
 * <template-edit-toolbar>'s viewModel.
 */
let EditToolbarVM = Map.extend({
  define: {
    /**
     * @property {A2JTemplate} editToolbar.ViewModel.prototype.define.template template
     * @parent editToolbar.ViewModel
     *
     * The A2JTemplate instance used in the template edit page.
     */
    template: {
      value: null
    },

    /**
     * @property {String} editToolbar.ViewModel.prototype.define.serializedTemplate serializedTemplate
     * @parent editToolbar.ViewModel
     *
     * This is the string representation of [template] after being serialized,
     * it is used as the value of a hidden input post to the server when user
     * clicks the "Test Assemble" button.
     */
    serializedTemplate: {
      get() {
        let template = this.attr('template');
        return JSON.stringify(template.serialize());
      }
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: EditToolbarVM,
  tag: 'template-edit-toolbar'
});

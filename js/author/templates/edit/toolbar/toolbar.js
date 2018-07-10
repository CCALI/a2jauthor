import CanMap from "can-map";
import Component from "can-component";
import template from './toolbar.stache';

import "can-map-define";

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
export let EditToolbarVM = CanMap.extend({
  define: {
    /**
     * @property {A2JTemplate} editToolbar.ViewModel.prototype.define.guideId guideId
     * @parent editToolbar.ViewModel
     *
     * The currently loaded guideId
     */
    guideId: {
      value: null
    },

    /**
     * @property {A2JTemplate} editToolbar.ViewModel.prototype.define.template template
     * @parent editToolbar.ViewModel
     *
     * The A2JTemplate instance used in the template edit page.
     */
    template: {
      value: null
    }
  },

  saveTemplate() {
    this.attr('template').save();
  }
});

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: EditToolbarVM,
  tag: 'template-edit-toolbar'
});

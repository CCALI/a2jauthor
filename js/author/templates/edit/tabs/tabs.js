import template from './tabs.stache';
import Component from "can-component";
import _throttle from 'lodash/throttle';
import TemplateEditTabsVM from './tabs-vm';
import addElementsTabTpl from './add-elements-tab.stache';
import templateOptionsTabTpl from './template-options-tab.stache';

import 'can/view/';

can.view.preload('add-elements-tab-tpl', addElementsTabTpl);
can.view.preload('template-options-tab-tpl', templateOptionsTabTpl);

/**
 * @module TemplateEditTabs
 * @parent api-components
 *
 * The tabs shown in the template edit page
 */
export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'template-edit-tabs',
  viewModel: TemplateEditTabsVM,

  helpers: {
    not(value) {
      return !value;
    }
  },

  events: {
    '{templateState} change': _throttle(function() {
      const template = this.viewModel.attr('template');
      template.save();
    }, 5000)
  }
});

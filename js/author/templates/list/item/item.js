import Component from 'can/component/';
import template from './item.stache!';
import Map from 'can/map/';

import './item.less!';
import 'can/map/define/';

/**
 * @module {Module} author/templates/list/item/
 * @parent api-components
 */

/**
 * @function TemplatesListItemViewModel
 * Constructor function used as the viewModel of the `<templates-list-item>` component.
 */
export let Item = Map.extend({
  define: {
    hovered: {
      value: false,
    }
  }
});

/**
 * @function TemplateListItemComponent
 * Constructor function that defines the custom `<templates-list-item>` tag behavior.
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'templates-list-item',
  events: {
    '.template-details mouseenter': function() {
      this.scope.attr('hovered', true);
    },

    '.template-details mouseleave': function() {
      this.scope.attr('hovered', false);
    }
  }
});

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
    /**
     * @property {Boolean} TemplatesListItemViewModel.prototype.define.hovered hovered
     *
     * Whether the mouse pointer is over the section of the component where the
     * details of the template are rendered, it is used to show/hide the delete/restore
     * links. In mobile this flag will be true if user taps the element.
     */
    hovered: {
      value: false,
    },

    /**
     * @property {Number} TemplatesListItemViewModel.prototype.define.transitionTime transitionTime
     *
     * The number of ms after which the delete/restore action sets `template.active`
     * to its final value, it's done async to be able to animate out the component.
     */
    transitionTime: {
      type: 'number',
      value: 1000
    },

    /**
     * @property {Boolean} TemplatesListItemViewModel.prototype.define.deleting deleting
     *
     * Whether the user deletes this template, when set it adds/removes a `deleting`
     * css class to the element to fire up the delete animation.
     */
    deleting: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} TemplatesListItemViewModel.prototype.define.restoring restoring
     *
     * Whether the user restores this template, when set it adds/remove a `restoring`
     * css class to the element to fire up the restore animation
     */
    restoring: {
      type: 'boolean',
      value: false
    }
  },

  /**
   * @function TemplatesListItemViewModel.prototype.deleteTemplate deleteTemplate
   *
   * It sets up the proper flags to animate out the component and make sure its
   * `active` state is set to `false` after `transitionTime` has passed.
   */
  deleteTemplate() {
    let template = this.attr('template');
    let delay = this.attr('transitionTime');

    this.attr('deleting', true);
    template.attr('deleted', true);

    setTimeout(() => {
      this.attr('deleting', false);
      template.attr('active', false);
    }, delay);

    return false;
  },

  /**
   * @function TemplatesListItemViewModel.prototype.restoreTemplate restoreTemplate
   *
   * It sets up the proper flags to animate out the component and make sure its
   * `active` state is set to `true` after `transitionTime` has passed.
   */
  restoreTemplate() {
    let template = this.attr('template');
    let delay = this.attr('transitionTime');

    this.attr('restoring', true);
    template.attr('restored', true);

    setTimeout(() => {
      this.attr('restoring', false);
      template.attr('active', true);
    }, delay);

    return false;
  }
});

/**
 * @function TemplateListItemComponent
 * Constructor function that defines the custom `<templates-list-item>` tag behavior.
 */
export default Component.extend({
  template,
  leakScope: false,
  viewModel: Item,
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

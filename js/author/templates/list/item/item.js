import CanMap from 'can-map'
import template from './item.stache'
import Component from 'can-component'

import 'can-map-define'

/**
 * @module {Module} templatesListItem <templates-list-item>
 * @parent api-components
 *
 * This component takes care of rendering the details of a given template (e.g
 * title, last modified date). It also allows the user to delete the template
 * or restore it.
 *
 * ## Use
 *
 * @codestart
 * <templates-list-item
 *   is-draggable="true"
 *   template="{template}">
 * </templates-list-item>
 * @codeend
 */

/**
 * @property {can.Map} templatesListItem.ViewModel
 * @parent templatesListItem
 *
 * `<templates-list-item>`'s viewModel.
 */
export let Item = CanMap.extend({
  define: {
    /**
     * @property {Boolean} templatesListItem.ViewModel.prototype.define.hovered hovered
     * @parent templatesListItem.ViewModel
     *
     * Whether the mouse pointer is over the section of the component where the
     * details of the template are rendered, it is used to show/hide the delete/restore
     * links. In mobile this flag will be true if user taps the element.
     */
    hovered: {
      value: false
    },

    /**
     * @property {Number} templatesListItem.ViewModel.prototype.define.transitionTime transitionTime
     * @parent templatesListItem.ViewModel
     *
     * The number of ms after which the delete/restore action sets `template.active`
     * to its final value, it's done async to be able to animate out the component.
     */
    transitionTime: {
      type: 'number',
      value: 1000
    },

    /**
     * @property {Boolean} templatesListItem.ViewModel.prototype.define.deleting deleting
     * @parent templatesListItem.ViewModel
     *
     * Whether the user deletes this template, when set it adds/removes a `deleting`
     * css class to the element to fire up the delete animation.
     */
    deleting: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} templatesListItem.ViewModel.prototype.define.restoring restoring
     * @parent templatesListItem.ViewModel
     *
     * Whether the user restores this template, when set it adds/remove a `restoring`
     * css class to the element to fire up the restore animation
     */
    restoring: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {String} templatesListItem.ViewModel.prototype.define.updatedAtFromNow updatedAtFromNow
     * @parent templatesListItem.ViewModel
     *
     * This a string with the relative time since the template was updated.
     *
     * e.g: "one month ago"
     */
    updatedAtFromNow: {
      get () {
        let template = this.attr('template')
        let updatedAt = template.attr('updatedAt')
        return updatedAt.isValid() ? updatedAt.fromNow() : ''
      }
    },

    /**
     * @property {Boolean} templatesListItem.ViewModel.prototype.define.isDraggable isDraggable
     * @parent templatesListItem.viewModel
     *
     * This defines if the list item is draggable
     *
     */
    isDraggable: {
      type: 'boolean',
      value: false
    }
  },

  /**
   * @function templatesListItem.ViewModel.prototype.deleteTemplate deleteTemplate
   * @parent templatesListItem.ViewModel
   *
   * It sets up the proper flags to animate out the component and make sure its
   * `active` state is set to `false` after `transitionTime` has passed.
   */
  deleteTemplate () {
    let template = this.attr('template')
    let delay = this.attr('transitionTime')

    this.attr('deleting', true)
    template.attr('deleted', true)

    setTimeout(() => {
      this.attr('deleting', false)
      template.attr('active', false)
      template.save()
    }, delay)

    return false
  },

  /**
   * @function templatesListItem.ViewModel.prototype.restoreTemplate restoreTemplate
   * @parent templatesListItem.ViewModel
   *
   * It sets up the proper flags to animate out the component and make sure its
   * `active` state is set to `true` after `transitionTime` has passed.
   */
  restoreTemplate () {
    let template = this.attr('template')
    let delay = this.attr('transitionTime')

    this.attr('restoring', true)
    template.attr('restored', true)

    setTimeout(() => {
      this.attr('restoring', false)
      template.attr('active', true)
      template.save()
    }, delay)

    return false
  },

  setHovering () {
    this.attr('hovered', true)
  },

  setNotHovering () {
    this.attr('hovered', false)
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: Item,
  tag: 'templates-list-item'
})

import Component from 'can-component'
import template from './button-dropdown.stache'

/**
 * @module {function} components/button-dropdown/ <button-dropdown>
 * @parent api-components
 * @signature `<button-dropdown>`
 *
 * Thin wrapper to create the button toolbar components below the header of each
 * page. It just enforces the style and has no functionality by itself.
 */
export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'button-dropdown'
})

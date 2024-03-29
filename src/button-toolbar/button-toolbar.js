import Component from 'can-component'
import template from './button-toolbar.stache'

/**
 * @module {function} components/button-toolbar/ <button-toolbar>
 * @parent api-components
 * @signature `<button-toolbar>`
 *
 * Thin wrapper to create the button toolbar components below the header of each
 * page. It just enforces the style and has no functionality by itself.
 */
export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'button-toolbar'
})

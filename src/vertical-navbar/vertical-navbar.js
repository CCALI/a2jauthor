import CanMap from 'can-map'
import items from './navbar-items'
import Component from 'can-component'
import template from './vertical-navbar.stache'

import 'can-map-define'

/**
 * @module {Module} author/vertical-navbar <vertical-navbar>
 * @parent api-components
 *
 * Global app navigation, fixed to the left or right side of the browser window.
 *
 * ## Use
 *
 * @codestart
 *  <vertical-navbar theme="inverse" {(page)}="{page}"/>
 * @codeend
 */

/**
 * @property {can.Map} verticalNavbar.ViewModel
 * @parent author/vertical-navbar
 *
 * `<vertical-navbar>`'s viewModel.
 */
export const VerticalNavbarVM = CanMap.extend('VerticalNavbarVM', {
  define: {
    // passed in from app.stache
    previewPageName: {},
    authorVersion: {},

    /**
     * @property {String} verticalNavbar.ViewModel.prototype.define.page page
     * @parent verticalNavbar.ViewModel
     *
     * Used to track the currently selected tab
     */
    page: {},

    /**
     * @property {can.List} verticalNavbar.ViewModel.prototype.define.items items
     * @parent verticalNavbar.ViewModel
     *
     * This is a "virtual" list containing the possible tabs user can visit,
     * this makes the rendering of the navbar a lot simpler.
     */
    items: {
      value: items
    },

    /**
     * @property {String} verticalNavbar.ViewModel.prototype.define.theme theme
     * @parent verticalNavbar.ViewModel
     *
     * The navbar has two "themes" (`inverse` and `default`) and this property
     * controls which of them to use, defaults to `default`.
     */
    theme: {
      type: 'string',
      value: 'default',
      set (val) {
        if (val !== 'default' && val !== 'inverse') {
          return 'default'
        }

        return val
      }
    },

    /**
     * @property {String} verticalNavbar.ViewModel.prototype.define.position position
     * @parent verticalNavbar.ViewModel
     *
     * Whether to show the navbar at the `left` or `right` side of the viewport.
     */
    position: {
      type: 'string',
      value: 'left',
      set (val) {
        if (val !== 'left' && val !== 'right') {
          return 'left'
        }

        return val
      }
    }
  },

  /**
   * @property {function} verticalNavbar.ViewModel.prototype.setPage setPage
   * @parent verticalNavbar.ViewModel
   *
   * This callback sets [verticalNavbar.ViewModel.prototype.page] which is bound to
   * `appState` (see `author/app.stache`) to handle the navigation between tabs.
   */
  setPage (item) {
    // handles side effect to clear previewPageName in appState
    // even if Preview navbar button was already active
    this.dispatch('setPageFired', [item.attr('page')])

    this.attr('page', item.attr('page'))
  },

  connectedCallback () {
    const previewHandler = (ev, pageName) => {
      if (pageName === 'preview') {
        this.attr('previewPageName', '')
      }
    }
    this.listenTo('setPageFired', previewHandler)

    return () => {
      this.stopListening('setPageFired', previewHandler)
    }
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'vertical-navbar',
  ViewModel: VerticalNavbarVM
})

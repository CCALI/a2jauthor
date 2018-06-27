import $ from 'jquery'
import CanMap from 'can-map'
import Component from 'can-component'
import template from './debug-menu.stache'
import _isFunction from 'lodash/isFunction'

/**
 * @module {Module} author/debug-menu <author-debug-menu>
 * @parent api-components
 *
 * This component renders some buttons that allow the user (author) to debug
 * the interview in the "preview" tab. Among these options there is the button
 * that toggles the variables panel and the button that takes the user straight
 * to the page edit modal.
 *
 * ## Use
 *
 * @codestart
 *   <author-debug-menu {(app-state)}="appState" />
 * @codeend
 */

let DebugMenuVM = CanMap.extend({
  resumeEdit () {
    this.attr('appState.page', 'pages')
  }
})

export default Component.extend({
  view: template,
  viewModel: DebugMenuVM,
  tag: 'author-debug-menu',

  events: {
    '.btn-variables-panel click': function () {
      let appState = this.viewModel.attr('appState')
      appState.toggleDebugPanel()
    },

    '.btn-fill-sample click': function () {
      $('#author-app').trigger('author:fill-page-sample')
    },

    '.btn-resume-edit click': function () {
      let vm = this.viewModel
      let appState = vm.attr('appState')
      let previewPageName = appState.attr('previewPageName')

      let $pageEditDialog = $('.page-edit-form')
      let dialogInstance = $pageEditDialog.dialog('instance')

      // return user to the pages tab.
      vm.resumeEdit()

      // if user enters preview mode by clicking the preview tab, do not try
      // to open the edit page dialog, it should only be done when user clicks
      // the preview button in the edit page dialog.
      if (dialogInstance && previewPageName) {
        appState.attr('previewPageName', '')
        $pageEditDialog.dialog('open')
      }
    },

    '.btn-edit-this click': function () {
      let vm = this.viewModel
      let appState = vm.attr('appState')
      let pageName = appState.attr('interviewPageName')

      if (_isFunction(window.gotoPageEdit)) {
        vm.resumeEdit()
        window.gotoPageEdit(pageName)
      }
    }
  },

  leakScope: true
})

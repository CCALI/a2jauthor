import navbarItems from 'a2jauthor/src/vertical-navbar/navbar-items'

/**
 * @module {{}} author/utils/tabs-routing tabs-routing
 * @parent api-utils
 *
 * @option {function} tabsRouting
 *
 * This function takes the `appState` instance and listen to changes in the `page`
 * property to manually load the requested page using the existing tabs code. This logic
 * should not be needed once the app is refactored entirely, and the logic to load each
 * page is in a Component.
 *
 */
export default function tabsRouting (appState) {
  const onPageChange = function (evt, newPage) {
    if (newPage !== 'templates') {
      appState.templateId = undefined
      appState.action = undefined
    }

    // TODO: remove this side effect when All Files refactored to CanJS
    if (newPage === 'files' && window.gGuide) {
      window.updateAttachmentFiles()
    }

    const item = navbarItems.filter(item => item.page === newPage).shift()
    if (item && item.ref) {
      window.gotoTabOrPage(item.ref)
    }
  }

  // navigate to the right page/tab on load.
  onPageChange(null, appState.page)

  // listen to the app state changes and manually load the selected page.
  appState.bind('page', onPageChange)
}

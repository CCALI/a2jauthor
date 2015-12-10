import navbarItems from 'author/vertical-navbar/navbar-items';

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
export default function tabsRouting(appState) {

  let onPageChange = function(evt, newPage) {
    if (newPage !== 'templates') {
      appState.removeAttr('id');
      appState.removeAttr('action');
    }

    let item = navbarItems.filter(item => item.page === newPage).shift();
    window.gotoTabOrPage(item.ref);
  };

  // navigate to the right page/tab on load.
  onPageChange(null, appState.attr('page'));

  // listen to the app state changes and manually load the selected page.
  appState.bind('page', onPageChange);
}

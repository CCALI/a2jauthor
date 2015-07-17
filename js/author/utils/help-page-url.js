const basePath = 'http://author.a2jauthor.org/csh5/';

/**
 * @module {{}} author/utils/help-page-url help-page-url
 * @parent api
 *
 * @option {function} pageToHelpUrl
 *
 * This function takes an string representing the `page` attribute from the
 * `appState` (an attribute bound to can.route) and generates the path to
 * the a2j author help page.
 *
 */
export default function(page) {
  let path = page.charAt(0).toUpperCase() + page.substring(1);
  return basePath + path;
}

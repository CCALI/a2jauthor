import Component from 'can/component/';
import template from './list.stache!';
import Map from 'can/map/';

import './item/';
import './list.less!';
import 'can/map/define/';

/**
 * @module {Module} author/templates/list/
 * @parent api-components
 *
 * Provides the view model and component constructors for the `<templates-list>`
 * custom tag, which takes care of displaying a list of templates created by the
 * logged in user.
 */


/**
 * @function TemplatesListViewModel
 * Constructor function used as the `viewModel` of the `<templates-list>` component.
 */
export let List = Map.extend({
  define: {}
});

/**
 * @function TemplatesListComponent
 * Constructor function that defines the custom `<templates-list>` tag behavior.
 */
export default Component.extend({
  template,
  viewModel: List,
  leakScope: false,
  tag: 'templates-list'
});

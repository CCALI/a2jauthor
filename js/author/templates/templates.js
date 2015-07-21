import Map from 'can/map/';
import Component from 'can/component/';
import template from './templates.stache!';
import Template from 'author/models/template';

import './list/';
import 'can/map/define/';
import './templates.less!';

/**
 * @module {Module} author/templates/list/
 * @parent api-components
 *
 * Provides the view model and component constructor for the `<templates-page>`
 * custom tag which takes care of displaying the templates list and options to
 * operate on the list (like filtering and sorting).
 */

/**
 * @function TemplatesPageViewModel
 * Constructor used as the viewModel of the `<templates-page>` component.
 */
export let Templates = Map.extend({
  define: {
    templates: {
      get() {
        return Template.findAll();
      }
    }
  }
});

/**
 * @function TemplatesPageComponent
 * Constructor function that defines the custom `<templates-page>` tag behavior.
 */
export default Component.extend({
  template,
  leakScope: false,
  viewModel: Templates,
  tag: 'templates-page'
});

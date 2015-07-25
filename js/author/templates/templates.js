import Map from 'can/map/';
import Component from 'can/component/';
import template from './templates.stache!';
import Template from 'author/models/template';

import './list/';
import './sortbar/';
import './toolbar/';
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
    activeFilter: {
      value: 'active'
    },

    sortCriteria: {
      value: {
        key: 'buildOrder',
        direction: 'asc'
      }
    },

    templates: {
      get() {
        return Template.findAll();
      }
    },

    displayList: {
      get: function() {
        let def = this.attr('templates');
        let filter = this.attr('activeFilter');
        let criteria = this.attr('sortCriteria');

        return def.then(templates => this.filterList(templates, filter))
          .then(templates => this.sortList(templates, criteria));
      }
    }
  },

  sortList(templates, criteria) {
    let {key, direction} = criteria.attr();
    templates.sortBy(key, direction);
    return templates;
  },

  filterList(templates, filter) {
    let filtered;

    switch (filter) {
      case 'all':
        filtered = templates.slice();
        break;

      case 'active':
        filtered = templates.filter(template => template.attr('active'));
        break;

      case 'deleted':
        filtered = templates.filter(template => !template.attr('active'));
        break;
    }

    return filtered;
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

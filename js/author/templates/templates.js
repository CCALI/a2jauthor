import Map from 'can/map/';
import Component from 'can/component/';
import template from './templates.stache!';
import Template from 'author/models/template';

import './list/';
import './sortbar/';
import './toolbar/';
import 'author/alert/';
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
    /**
     * @property {String} TemplatesPageViewModel.prototype.define.activeFilter activeFilter
     *
     * It holds the value of the state by which the templates list is being
     * filtered, the possible values are `all`, `active` and `deleted`.
     */
    activeFilter: {
      value: 'active'
    },

    /**
     * @property {{}} TemplatesPageViewModel.prototype.define.sortCriteria sortCriteria
     *
     * It holds the key and the direction by which the templates list is sorted,
     * by default the list is sorted by `buildOrder` asc.
     */
    sortCriteria: {
      value: {
        key: 'buildOrder',
        direction: 'asc'
      }
    },

    /**
     * @property {String} TemplatesPageViewModel.prototype.define.searchToken searchToken
     *
     * It holds the search string typed by the user in the search form.
     */
    searchToken: {
      type: 'string',
      value: ''
    },

    /**
     * @property {Boolen} TemplatesPageViewModel.prototype.define.deletedAlertState deletedAlertState
     *
     * Each time a template is deleted, a small alert should be displayed to indicate
     * the user that the template is actually being deleted and it also allows the user
     * to restore it back, this property controls whether the alert is `opened` (visible)
     * or `closed`.
     */
    deletedAlertState: {
      type: 'string',
      value: 'closed'
    },

    /**
     * @property {Boolean} TemplatesPageViewModel.prototype.define.restoredAlertState restoredAlertState
     *
     * Same as `deletedAlertState` but this one controls the alert shown for templates
     * that are being restored.
     */
    restoredAlertState: {
      type: 'string',
      value: 'closed'
    },

    /**
     * @property {Number} TemplatesPageViewModel.prototype.define.alertTransitionTime alertTransitionTime
     *
     * The number of miliseconds after which the alert messages when user deletes/restores
     * templates are visible before they hide themselves.
     */
    alertTransitionTime: {
      type: 'number',
      value: 5000
    },

    /**
     * @property {Boolean} TemplatesPageViewModel.prototype.define.listIsDraggable listIsDraggable
     *
     * Whether the templates list can be sorted using drag & drop. Since drag & drop
     * only makes sense to define the `buildOrder`, the items can't be dragged if the
     * plates are sorted by any other criteria.
     */
    listIsDraggable: {
      get() {
        return this.attr('sortCriteria.key') === 'buildOrder';
      }
    }
  },

  /**
   * @function TemplatesPageViewModel.prototype.init init
   *
   * Function executed when the viewmodel is instantiated, it takes care of
   * fetching the templates and setting `templatesPromise`, `templates` and
   * `displayList` when it's done.
   */
  init() {
    let promise = Template.findAll().then(templates => {
      this.attr('templates', templates);
      this.attr('displayList', this.makeDisplayList());
    });

    this.attr('templatesPromise', promise);
  },

  sortList(templates) {
    let criteria = this.attr('sortCriteria');
    let {key, direction} = criteria.attr();
    templates.sortBy(key, direction);
    return templates;
  },

  filterList(templates) {
    let filtered;
    let filter = this.attr('activeFilter');

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
  },

  performSearch(templates) {
    let searchToken = this.attr('searchToken');
    return searchToken ? templates.search(searchToken) : templates;
  },

  makeDisplayList() {
    let templates = this.attr('templates');

    return this.performSearch(
      this.sortList(
        this.filterList(templates)
      )
    );
  },

  restoreTemplate(template) {
    template.attr({
      deleted: false,
      active: true
    });
    this.attr('deletedAlertState', 'closed');
  },

  deleteTemplate(template) {
    template.attr({
      restored: false,
      active: false
    });
    this.attr('restoredAlertState', 'closed');
  },

  /**
   * @function TemplatesPageViewModel.prototype.handleDeletedTemplates handleDeletedTemplates
   *
   * This function is executed when the list of templates changes, it observes the
   * templates set as `deleted` in order to show/hide the alert messages.
   */
  handleDeletedTemplates() {
    let templates = this.attr('templates');
    let alreadyDeleted = this.attr('deletedTemplates');
    let beingDeleted = templates.filter(template => template.attr('deleted'));

    // remove the deleted flag from the previously deleted templates, otherwise
    // they will continue to show up in the alert component when other templates
    // are deleted later on.
    if (alreadyDeleted && alreadyDeleted.attr('length')) {
      alreadyDeleted.each(template => template.removeAttr('deleted'));
    }

    if (beingDeleted.attr('length')) {
      this.attr('deletedTemplates', beingDeleted);
      this.attr('deletedAlertState', 'opened');
    }
  },

  /**
   * @function TemplatesPageViewModel.prototype.handleRestoredTemplates handleRestoredTemplates
   *
   * Same as `handleDeletedTemplates` but for templates being restored.
   */
  handleRestoredTemplates() {
    let templates = this.attr('templates');
    let alreadyRestored = this.attr('restoredTemplates');
    let beingRestored = templates.filter(template => template.attr('restored'));

    if (alreadyRestored && alreadyRestored.attr('length')) {
      alreadyRestored.each(template => template.removeAttr('restored'));
    }

    if (beingRestored.attr('length')) {
      this.attr('restoredTemplates', beingRestored);
      this.attr('restoredAlertState', 'opened');
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
  tag: 'templates-page',

  helpers: {
    listStateClassName() {
      let className;
      let filter = this.attr('activeFilter');

      switch (filter) {
        case 'all':
          className = 'all-templates';
          break;

        case 'active':
          className = 'active-templates';
          break;

        case 'deleted':
          className = 'deleted-templates';
          break;
      }

      return className;
    }
  },

  events: {
    '{templates} change': function() {
      this.viewModel.handleDeletedTemplates();
      this.viewModel.handleRestoredTemplates();
    },

    '{viewModel} activeFilter': function() {
      let list = this.viewModel.makeDisplayList();
      this.viewModel.attr('displayList', list);
    },

    '{viewModel} sortCriteria': function() {
      let list = this.viewModel.attr('displayList');
      this.viewModel.sortList(list);
    },

    '{viewModel} searchToken': function() {
      let list = this.viewModel.makeDisplayList();
      let result = this.viewModel.performSearch(list);
      this.viewModel.attr('displayList', result);
    }
  }
});

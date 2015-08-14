import Map from 'can/map/';
import Component from 'can/component/';
import template from './templates.stache!';
import Template from 'author/models/template';

import './list/';
import './list/sortbar/';
import './list/toolbar/';
import 'author/alert/';
import 'author/loading/';
import 'can/map/define/';
import './templates.less!';

/**
 * @module {Module} templatesPage <templates-page>
 * @parent api-components
 *
 * This component takes care of displaying the templates list and other child
 * components that allow the user to filter, sort or search particular templates
 * in the list.
 *
 * ## Use
 *
 * @codestart
 * <templates-page></templates-page>
 * @codeend
 */

/**
 * @property {can.Map} templatesPage.ViewModel
 * @parent templatesPage
 *
 * `<templates-page>`'s viewModel.
 */
export let Templates = Map.extend({
  define: {
    /**
     * @property {String} templatesPage.ViewModel.prototype.define.activeFilter activeFilter
     * @parent templatesPage.ViewModel
     *
     * It holds the value of the state by which the templates list is being
     * filtered, the possible values are `all`, `active` and `deleted`.
     */
    activeFilter: {
      value: 'active'
    },

    /**
     * @property {{}} templatesPage.ViewModel.prototype.define.sortCriteria sortCriteria
     * @parent templatesPage.ViewModel
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
     * @property {String} templatesPage.ViewModel.prototype.define.searchToken searchToken
     * @parent templatesPage.ViewModel
     *
     * It holds the search string typed by the user in the search form.
     */
    searchToken: {
      type: 'string',
      value: ''
    },

    /**
     * @property {Boolen} templatesPage.ViewModel.prototype.define.openDeletedAlert openDeletedAlert
     * @parent templatesPage.ViewModel
     *
     * Each time a template is deleted, a small alert should be displayed to
     * indicate the user that the template is actually being deleted and it
     * also allows the user to restore it back, this property controls whether
     * the alert is visible or not.
     */
    openDeletedAlert: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.openRestoredAlert openRestoredAlert
     * @parent templatesPage.ViewModel
     *
     * Same as `openDeletedAlert` but this one controls the alert shown for
     * templates that are being restored.
     */
    openRestoredAlert: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Number} templatesPage.ViewModel.prototype.define.alertAutoCloseTime alertAutoCloseTime
     * @parent templatesPage.ViewModel
     *
     * The number of miliseconds after which the alert messages when user deletes/restores
     * templates are visible before they hide themselves.
     */
    alertAutoCloseTime: {
      type: 'number',
      value: 5000
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.listIsDraggable listIsDraggable
     * @parent templatesPage.ViewModel
     *
     * Whether the templates list can be sorted using drag & drop. Since drag & drop
     * only makes sense to define the `buildOrder`, the items can't be dragged if the
     * templates are sorted by any other criteria.
     */
    listIsDraggable: {
      get() {
        return this.attr('sortCriteria.key') === 'buildOrder';
      }
    },

    /**
     * @property {Boolean} templatesPage.ViewModel.prototype.define.noSearchResults noSearchResults
     * @parent templatesPage.ViewModel
     *
     * Whether the search performed by the user has no matches, this property
     * checks if there is a truthy `searchToken` which means user has performed
     * a search and `displayList`'s length is falsy which indicates there are no
     * matches for that `searchToken`.
     */
    noSearchResults: {
      get() {
        let searchToken = this.attr('searchToken');
        let displayList = this.attr('displayList');
        return searchToken.length && !displayList.attr('length');
      }
    }
  },

  /**
   * @function templatesPage.ViewModel.prototype.init init
   * @parent templatesPage.ViewModel
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
    this.attr('openDeletedAlert', false);
  },

  deleteTemplate(template) {
    template.attr({
      restored: false,
      active: false
    });
    this.attr('openRestoredAlert', false);
  },

  /**
   * @function templatesPage.ViewModel.prototype.updateDisplayList updateDisplayList
   * @parent templatesPage.ViewModel
   *
   * This function is meant to update the list when templates are removed or
   * restored, it generates the `displayList` again and compares it to the list
   * currently being displayed, the bound list is updated if there is a difference
   * between them (length).
   */
  updateDisplayList() {
    let displayList = this.makeDisplayList();
    let currentDisplayList = this.attr('displayList');

    if (displayList.attr('length') !== currentDisplayList.attr('length')) {
      this.attr('displayList', displayList);
    }
  },

  /**
   * @function templatesPage.ViewModel.prototype.handleDeletedTemplates handleDeletedTemplates
   * @parent templatesPage.ViewModel
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
      this.attr('openDeletedAlert', true);
    }
  },

  /**
   * @function templatesPage.ViewModel.prototype.handleRestoredTemplates handleRestoredTemplates
   * @parent templatesPage.ViewModel
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
      this.attr('openRestoredAlert', true);
    }
  }
});

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
      let vm = this.viewModel;

      vm.updateDisplayList();
      vm.handleDeletedTemplates();
      vm.handleRestoredTemplates();
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

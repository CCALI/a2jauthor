import Component from 'can/component/';
import Templates from './templates-vm';
import template from './templates.stache!';

import './list/';
import './list/sortbar/';
import './list/toolbar/';
import 'author/alert/';
import 'author/loading/';
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

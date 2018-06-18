import Component from 'can/component/';
import TemplatesVM from './templates-vm';
import template from './templates.stache';

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
  tag: 'templates-page',
  viewModel: TemplatesVM,

  helpers: {
    listStateClassName () {
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
    '{templates} change': function () {
      // required to resolve templatesPromise/templates?
    },

    '{displayList} length': function () {
      let vm = this.viewModel;

      vm.updateDisplayList();
      vm.handleDeletedTemplates();
      vm.handleRestoredTemplates();
    },

    '{viewModel} hasSorted': function () {
      let vm = this.viewModel;
      const hasSorted = vm.attr('hasSorted');

      if (hasSorted) {
        const templateIds = vm.updateTemplatesOrder();
        vm.saveTemplatesOrder(templateIds);
        setTimeout(() => {
          vm.attr('hasSorted', false);
        }, 0);
      }
    },

    '{viewModel} activeFilter': function () {
      let list = this.viewModel.makeDisplayList();
      this.viewModel.attr('displayList', list);
    },

    '{viewModel} sortCriteria': function () {
      let list = this.viewModel.attr('displayList');
      this.viewModel.sortList(list);
    },

    '{viewModel} searchToken': function () {
      let list = this.viewModel.makeDisplayList();
      let result = this.viewModel.performSearch(list);
      this.viewModel.attr('displayList', result);
    }
  }
});

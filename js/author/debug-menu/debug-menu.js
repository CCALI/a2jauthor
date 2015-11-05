import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './debug-menu.stache!';
import _isFunction from 'lodash/lang/isFunction';

let DebugMenuVM = Map.extend({
  resumeEdit() {
    this.attr('appState.page', 'pages');
  }
});

export default Component.extend({
  template,
  viewModel: DebugMenuVM,
  tag: 'author-debug-menu',

  events: {
    '.btn-resume-edit click': function() {
      let vm = this.viewModel;
      let appState = vm.attr('appState');
      let previewPageName = appState.attr('previewPageName');

      let $pageEditDialog = $('.page-edit-form');
      let dialogInstance = $pageEditDialog.dialog('instance');

      // return user to the pages tab.
      vm.resumeEdit();

      // if user enters preview mode by clicking the preview tab, do not try
      // to open the edit page dialog, it should only be done when user clicks
      // the preview button in the edit page dialog.
      if (dialogInstance && previewPageName) {
        appState.attr('previewPageName', '');
        $pageEditDialog.dialog('open');
      }
    },

    '.btn-edit-this click': function() {
      let vm = this.viewModel;
      let appState = vm.attr('appState');
      let pageName = appState.attr('interviewPageName');

      console.log('click edit', pageName);

      if (_isFunction(window.gotoPageEdit)) {
        vm.resumeEdit();
        window.gotoPageEdit(pageName);
      }
    }
  }
});

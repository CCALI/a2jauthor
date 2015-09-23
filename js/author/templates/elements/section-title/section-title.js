import Map from 'can/map/';
import Component from 'can/component/';
import contentTpl from './content.stache!'
import template from './section-title.stache!';

import 'can/view/';
import 'author/popover/';
import './section-title.less!';
import '../element-container/';

// preload stache partial
can.view.preload('section-title-content', contentTpl);

export let SectionTitleVM = Map.extend({
  define: {
    editEnabled: {
      value: false
    },

    editActive: {
      value: false
    }
  }
});

export default Component.extend({
  template,
  tag: 'section-title',

  viewModel: function(attrs) {
    return new SectionTitleVM(attrs.state);
  },

  events: {
    inserted($el) {
      let vm = this.viewModel;
      let rootViewModel = $el.parents('a2j-template').viewModel();

      vm.attr('rootViewModel', rootViewModel);
      rootViewModel.registerNodeViewModel(vm);
    },

    removed() {
      let vm = this.viewModel;
      let rootViewModel = vm.attr('rootViewModel');

      if (rootViewModel) {
        rootViewModel.deregisterNodeViewModel(vm);
      }
    },

    '{viewModel} editActive': function() {
      let vm = this.viewModel;
      let editActive = vm.attr('editActive');
      let rootViewModel = vm.attr('rootViewModel');

      if (editActive) {
        rootViewModel.toggleEditActiveNode(vm);
      }
    }
  }
});

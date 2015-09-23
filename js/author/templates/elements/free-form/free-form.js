import Map from 'can/map/';
import stache from 'can/view/stache/';
import Component from 'can/component/';
import template from './free-form.stache!';

import 'can/map/define/';
import './free-form.less!';
import '../element-container/';

export let FreeFormVM = Map.extend({
  define: {
    userContent: {
      value: ''
    },

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
  tag: 'free-form',

  viewModel: function(attrs) {
    return new FreeFormVM(attrs.state);
  },

  helpers: {
    a2jParse: function(templateSnippet) {
      templateSnippet = templateSnippet.isComputed ? templateSnippet() :
        templateSnippet;

      return stache(templateSnippet)();
    }
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

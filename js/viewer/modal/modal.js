import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './modal.stache!'

import 'can/map/define/';

export let ModalVM = Map.extend({
  define: {
    currentPage: {
      get() {
        let interview = this.attr('interview');
        let pageName = this.attr('rState.page');
        return interview.getPageByName(pageName);
      }
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-modal',
  viewModel: ModalVM,
  events: {
    'a click': function(el) {
      el.attr('target', '_blank');
    },
    '{viewModel} modalContent': function(vm, ev, newVal, oldVal) {
      if (newVal) {
        this.element.find('#pageModal').modal();
      }
    },
    '#pageModal hidden.bs.modal': function(el, ev) {
      this.viewModel.attr('modalContent', null);
    }
  },
  helpers: {
    eval: function(str) {
      str = typeof str === 'function' ? str() : str;
      return this.attr('logic').eval(str);
    }
  }
});
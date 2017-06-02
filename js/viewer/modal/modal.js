import Map from 'can/map/';
import Component from 'can/component/';
import template from './modal.stache!';

import 'can/map/define/';
import 'bootstrap/js/modal';

export let ModalVM = Map.extend({});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-modal',
  viewModel: ModalVM,

  helpers: {
    isGif(url = '') {
      const ext = url.split('.').pop();
      return ext.toLowerCase() === 'gif';
    },

    eval(str) {
      str = typeof str === 'function' ? str() : str;
      return this.attr('logic').eval(str);
    }
  },

  events: {
    'a click': function(el, ev) {
      // load new popup content
      if (el.attr('href').toLowerCase().indexOf('popup') !== -1) {
        ev.preventDefault();
        const pages = this.viewModel.attr('interview.pages');

        if (pages) {
          const pageName = $(el.get(0)).attr("href").replace("popup://", "").replace("POPUP://", "").replace("/", ""); //pathname is not supported in FF and IE.
          const page = pages.find(pageName);
          // popup content is only title, text, and textAudio
          // but title is internal descriptor so set to empty string
          this.viewModel.attr('modalContent', {
            title: '',
            text: page.text,
            audioURL: page.textAudioURL
          });
        } else { //external link
          el.attr('target', '_blank');
        }
      }
    },

    '{viewModel} modalContent': function(vm, ev, newVal) {
      if (newVal) {
        this.element.find('#pageModal').modal();
      }
    },

    '#pageModal hidden.bs.modal': function() {
      this.viewModel.attr('modalContent', null);
    }
  }
});

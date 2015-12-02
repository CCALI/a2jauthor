import Map from 'can/map/';
import Component from 'can/component/';
import contentTpl from './content.stache!';
import template from './section-title.stache!';

import 'can/view/';

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
    '.title-input keyup': function($el) {
      this.viewModel.attr('title', $el.val());
    }
  }
});

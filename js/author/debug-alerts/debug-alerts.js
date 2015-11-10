import Map from 'can/map/';
import Component from 'can/component/';
import template from './debug-alerts.stache!';

import 'can/map/define/';

const DebugAlerts = Map.extend({
  define: {
    alertMessages: {
      value: []
    }
  }
});

export default Component.extend({
  template,
  viewModel: DebugAlerts,
  tag: 'author-debug-alerts',

  events: {
    '.btn-dismiss click': function() {
      let $el = this.element;
      let vm = this.viewModel;
      let alertMessages = vm.attr('alertMessages');

      $el.slideUp('slow', function() {
        alertMessages.replace([]);
      });
    }
  }
})

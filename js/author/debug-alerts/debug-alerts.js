import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import template from './debug-alerts.stache!';

import 'can/map/define/';

const DebugAlerts = Map.extend({
  define: {
    alertMessages: {
      Value: List
    },

    messagesCount: {
      get() {
        let messages = this.attr('alertMessages');

        return messages
          .filter(m => m.attr('open'))
          .attr('length');
      }
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

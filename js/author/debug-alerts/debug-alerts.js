import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import template from './debug-alerts.stache!';

import 'can/map/define/';

/**
 * @module {Module} author/debug-alerts <author-debug-alerts>
 * @parent api-components
 *
 * List of warnings/errors regarding the interview (e.g variable names that
 * are too long for HotDocs) shown to the author in preview mode.
 *
 * ## Use
 *
 * @codestart
 *  <author-debug-alerts {(alert-messages)}="alertMessages" />
 * @codeend
 */

/**
 * @property {can.Map} debugAlerts.viewModel
 * @parent author/debug-alerts
 *
 * `<author-debug-alerts>`'s viewModel.
 */
const DebugAlerts = Map.extend({
  define: {
    /**
     * @property {can.List} debugAlerts.viewModel.prototype.define.alertMessages alertMessages
     * @parent debugAlerts.viewModel
     *
     * List of error/warning messages related to an interview.
     */
    alertMessages: {
      Value: List
    },

    /**
     * @property {Number} debugAlerts.viewModel.prototype.define.messagesCount messagesCount
     * @parent debugAlerts.viewModel
     *
     * Number of messages currently visible to the user (when the user dismisses
     * a message this number gets updated).
     */
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

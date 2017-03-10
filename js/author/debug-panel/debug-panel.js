import Map from 'can/map/';
import List from 'can/list/';
import _find from 'lodash/find';
import Component from 'can/component/';
import template from './debug-panel.stache!';

import 'can/map/define/';

/**
 * @property {can.Map} authorDebugPanel.ViewModel
 * @parent <author-debug-panel>
 *
 * `<author-debug-panel>`'s viewModel.
 */
export let DebugPanelVM = Map.extend({
  define: {
    /**
     * @property {can.List} authorDebugPanel.ViewModel.prototype.variables variables
     * @parent authorDebugPanel.ViewModel
     *
     * list of variables used in the interview and their values
     */
    variables: {
      get() {
        let interview = this.attr('interview');

        return interview ?
          interview.attr('variablesList') :
          new List([]);
      }
    },

    /**
     * @property {can.List} authorDebugPanel.ViewModel.prototype.traceLogic traceLogic
     * @parent authorDebugPanel.ViewModel
     *
     * list of trace messages not yet added to the traceLogicList
     *
     * This is the external API used by other components for adding messages
     * to the trace panel. This way, other components do not need to know
     * how the traceLogicList is formatted. Messages can be added as a
     * single key/value pair or as a key and an array of messages.
     *
     * Each msg can also have a format, formats include
     * "ui", "info", "var", "val", "code", "valT", "valF"
     *
     * ## use
     *
     * @codestart
     * // add a single message
     * vm.attr('traceLogic').push({
     *   page: '1 - Intro'
     * });
     *
     * // add multiple messages
     * vm.attr('traceLogic').push({
     *   button: [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go!' } ]
     * });
     * @codeend
     */
    traceLogic: {
      value: function() {
        return new List();
      }
    },

    /**
     * @property {can.List} authorDebugPanel.ViewModel.prototype.traceLogicList traceLogicList
     * @parent authorDebugPanel.ViewModel
     *
     * list of trace messages formatted to be displayed in the trace panel
     *
     * Messages will be removed from the traceLogic property and grouped by page.
     * Messages within the current page can be updated by pushing a new message with the same key.
     */
    traceLogicList: {
      value: function() {
        return new List();
      },

      get(lastSetValue) {
        let traceLogic = this.attr('traceLogic');

        const checkPageExists = function(pageName) {
          return page => page.attr('pageName') === pageName;
        };

        const onEachMessage = function(currentPage) {
          return function(fragments, key) {
            let existingMessageUpdated = false;

            // all messages should be arrays, even if they only have one fragment
            // { msg: 'message' } -> [ { msg: 'message' } ]
            if (!(fragments && fragments.length)) {
              // key = fragments.msg.split(" ").join("_");
              fragments = [fragments];
            }


            if(key === "_IF") {
              key = fragments[1].msg.split(" ").join("_");
            }
            if(key === "_VS") {
              key = fragments[0].msg.split(" ").join("_");
            }


            // update message if it already exists, such as  user changing a variable
            // {'first name': [ { format: 'var', msg: 'first name' }, { msg: ' = ' }, { format: 'val', msg: 'sam' } ]
            // {'first name': [ { format: 'var', msg: 'first name' }, { msg: ' = ' }, { format: 'val', msg: 'manuel' } ]
            currentPage.attr('messages').each((message) => {
              if (message.attr('key') === key) {
                message.attr('fragments', fragments);
                existingMessageUpdated = true;
              }
            });

            // if this is a new message, add it
            if (!existingMessageUpdated) {
              currentPage.attr('messages').push({
                key: key,
                fragments: fragments
              });
            }
          };
        };

        // format all the unformatted traceLogic messages
        while (traceLogic.attr('length')) {
          let newMessage = traceLogic.shift();
          let pageName = newMessage.attr('page');

          // handle messages indicating the user navigated to a new page, like:
          // { page: '1 - Intro' }
          if (pageName) {
            // if this page already exists, skip it.
            // for instance, this could happen when using a repeat variable.
            const pageExists = !!_find(lastSetValue, checkPageExists(pageName));

            // if page doesn't exist, add it.
            if (!pageExists) {
              lastSetValue.push({
                pageName: pageName,
                messages: [ ]
              });
            }
          } else {
            let currentPage = lastSetValue.attr(lastSetValue.attr('length') - 1);
            if(currentPage) {
              newMessage.each(onEachMessage(currentPage));
            }
          }
        }

        return lastSetValue;
      }
    }
  },

  /**
   * @function authorDebugPanel.ViewModel.prototype.clearTraceLogicList clearTraceLogicList
   * @parent authorDebugPanel.ViewModel
   *
   * clear messages from the trace logic list
   *
   * Remove all message from the list, but leave a single entry for the current page.
   * This allows new messages to be added before the user navigates to a new page.
   */
  clearTraceLogicList() {
    let tr = this.attr('traceLogicList');
    let currentPage = tr.attr(tr.attr('length') - 1);
    currentPage.attr('messages').replace([]);
    tr.replace(currentPage);
  }
});

/**
 * @module {Module} author/debug-panel/ <author-debug-panel>
 * @parent api-components
 *
 * this component displays the debug-panel for the author view
 *
 * ## Use
 *
 * @codestart
 *   <author-debug-panel
 *     {interview}="viewerInterview" />
 * @codeend
 */
export default Component.extend({
  template,
  viewModel: DebugPanelVM,
  tag: 'author-debug-panel',

  helpers: {
    /**
     * @function authorDebugPanel.prototype.traceLogicFormat traceLogicFormat
     * @parent authorDebugPanel
     *
     * helper used to get the class name to format each message fragment's span
     */
    traceLogicFormat(format, msg) {
      format = (format && format.isComputed) ? format() : format;
      msg = (msg && msg.isComputed) ? msg() : msg;

      if (format === 'val') {
        format = (!msg) ? 'valBlank' :
                  ((msg === true || msg === 'true') ? 'valT' :
                   ((msg === false || msg === 'false') ? 'valF' : format.toLowerCase()));
      }

      return format;
    },
    /**
     * @function authorDebugPanel.prototype.traceLogicMessage traceLogicMessage
     * @parent authorDebugPanel
     *
     * Format a message - used for providing "blank" for empty values set by the user
     */
    traceLogicMessage(format, msg) {
      format = (format && format.isComputed) ? format() : format;
      msg = (msg && msg.isComputed) ? msg() : msg;

      return (format === 'val' && !msg) ? 'blank' : msg;
    }
  }
});

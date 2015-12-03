import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import template from './debug-panel.stache!';

import 'can/map/define/';

export let DebugPanelVM = Map.extend({
  define: {
    variables: {
      get() {
        let interview = this.attr('interview');

        return interview
          ? interview.attr('variablesList')
          : new List([]);
      }
    },

    traceLogic: {
      value: new List
    },

    traceLogicList: {
      value: new List,
      get(lastSetValue) {
        let traceLogic = this.attr('traceLogic');
        while (traceLogic.attr('length')) {
          let newMessage = traceLogic.shift();
          let pageName = newMessage.attr('page');

          if (pageName) {
            let pageExists = false;

            lastSetValue.each((page) => {
              if (page.attr('pageName') === pageName) {
                pageExists = true;
                return false;
              }
            });

            if (!pageExists) {
              lastSetValue.push({
                pageName: pageName,
                messages: [ ]
              });
            }
          } else {
            let currentPage = lastSetValue.attr(lastSetValue.attr('length') - 1);

            newMessage.each((fragments, key) => {
              let existingMessageUpdated = false;

              // all messages should be arrays, even if they only have one fragment
              // { msg: 'message' } -> [ { msg: 'message' } ]
              if (!(fragments && fragments.length)) {
                fragments = [ fragments ];
              }

              currentPage.attr('messages').each((message) => {
                if (message.attr('key') === key) {
                  message.attr('fragments', fragments);
                  existingMessageUpdated = true;
                }
              });

              if (!existingMessageUpdated) {
                currentPage.attr('messages').push({
                  key: key,
                  fragments: fragments
                })
              }
            });
          }
        }

        return lastSetValue;
      }
    }
  }
});

export default Component.extend({
  template,
  viewModel: DebugPanelVM,
  tag: 'author-debug-panel',

  events: {
    '#clearTrace click': function() {
      this.element.find('#tracer').empty();
    }
  },

  helpers: {
    traceLogicFormat(format, msg) {
      format = (format && format.isComputed) ? format() : format;
      msg = (msg && msg.isComputed) ? msg() : msg;

      if (format === 'val') {
        format = (!msg) ? 'valBlank' :
                  ((msg == true || msg == 'true') ? 'valT' :
                   ((msg == false || msg == 'false') ? 'valF' : format.toLowerCase()));
      }

      return format;
    },
    traceLogicMessage(format, msg) {
      format = (format && format.isComputed) ? format() : format;
      msg = (msg && msg.isComputed) ? msg() : msg;

      return (format === 'val' && !msg) ? "blank" : msg;
    }
  }
})

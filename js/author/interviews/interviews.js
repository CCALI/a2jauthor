import Map from 'can/map/';
import Component from 'can/component/';
import Guide from 'author/models/guide';
import template from './interviews.stache!';

import 'can/map/define/';
import './interviews.less!';

let Interviews = Map.extend({
  define: {
    interviews: {
      get() {
        return Guide.findAll();
      }
    },

    blankInterview: {
      get() {
        return {
          id: 'a2j',
          title: 'Blank Interview'
        };
      }
    }
  }
});

/**
 * @module {function} components/interviews/ <interviews-page>
 * @parent api-components
 * @signature `<interviews-page>`
 *
 * Displays a list of existing interviews.
 */
export default Component.extend({
  template,
  tag: 'interviews-page',
  viewModel: Interviews,
  events: {
    '.guide click': function(target) {
      this.element.find('.guide').removeClass('ui-state-active');
      target.addClass('ui-state-active');
    },

    '.guide dblclick': function() {
      window.openSelectedGuide();
    }
  },
  helpers: {
    formatFileSize: function(sizeInBytes) {
      sizeInBytes = sizeInBytes();
      let sizeInKB = Math.ceil(sizeInBytes / 1024);
      return sizeInKB ? `${sizeInKB}K` : '';
    }
  }
});

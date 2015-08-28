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
  leakScope: false,
  tag: 'interviews-page',
  viewModel: Interviews,
  events: {
    '.title click': function(target) {
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

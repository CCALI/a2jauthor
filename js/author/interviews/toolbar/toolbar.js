import Component from 'can/component/';
import template from './toolbar.stache!';

import './toolbar.less!';
import 'author/button-toolbar/';

/**
 * @module {function} components/interviews/toolbar/ <interviews-toolbar>
 * @parent api-components
 * @signature `<interviews-toolbar>`
 *
 * Displays buttons that allow user to open, delete, clone and upload interviews.
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'interviews-toolbar',

  events: {
    '.open-guide click': function() {
      window.openSelectedGuide();
    },

    '.clone-guide click': function() {
      window.dialogAlert({
        title:'Clone interview'
      });
    },

    '.delete-guide click': function() {
      window.archiveSelectedGuide();
    }
  }
});

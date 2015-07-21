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
  tag: 'interviews-toolbar'
});

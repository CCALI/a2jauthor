import Component from 'can/component/';
import template from './element-toolbar.stache!';

import './element-toolbar.less!';

/**
 * @module {Module} author/templates/elements/element-toolbar/ <element-toolbar>
 * @parent api-components
 *
 * Bottom toolbar shown in all "elements", it allows user to duplicate or
 * eliminate the element in the template where it belongs.
 *
 * ## Use
 *
 * @codestart
 * <element-toolbar></element-toolbar>
 * @codeend
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'element-toolbar'
});

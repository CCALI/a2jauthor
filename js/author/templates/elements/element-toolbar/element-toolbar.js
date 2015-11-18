import Map from 'can/map/';
import Component from 'can/component/';
import template from './element-toolbar.stache!';

import 'can/map/define/';

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

export let ElementToolbar = Map.extend({
  define: {},

  cloneNode() {
    let nodeScope = this.attr('nodeScope');

    if (nodeScope) {
      let rootNodeScope = nodeScope.attr('rootNodeScope');
      rootNodeScope.cloneNode(nodeScope);
    }

    return false;
  },

  deleteNode() {
    let nodeScope = this.attr('nodeScope');

    if (nodeScope) {
      let rootNodeScope = nodeScope.attr('rootNodeScope');
      rootNodeScope.deleteNode(nodeScope);
    }

    return false;
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'element-toolbar',
  viewModel: ElementToolbar
});

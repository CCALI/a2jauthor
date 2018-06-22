import CanMap from "can-map";
import Component from "can-component";
import _isFunction from 'lodash/isFunction';
import template from './element-toolbar.stache';

import "can-map-define";

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

export const ElementToolbar = CanMap.extend({
  define: {},

  clone() {
    const id = this.attr('nodeId');
    const cloneNode = this.attr('cloneNode');

    if (_isFunction(cloneNode)) {
      cloneNode(id);
    } else {
      console.error('cloneNode should be a function');
    }

    return false;
  },

  delete() {
    const id = this.attr('nodeId');
    const deleteNode = this.attr('deleteNode');

    if (_isFunction(deleteNode)) {
      deleteNode(id);
    } else {
      console.error('deleteNode should be a function');
    }

    return false;
  }
});

export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'element-toolbar',
  viewModel: ElementToolbar
});

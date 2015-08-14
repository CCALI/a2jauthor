import Map from 'can/map/';
import template from './list.stache!';
import Component from 'can/component/';
import _range from 'lodash/utility/range';

import './item/';
import './list.less!';
import 'can/map/define/';

/**
 * @function move
 * @hide true
 * @description
 *
 * Moves the item at the `start` index to the `end` index, it does not mutate
 * the provided array, it returns a new reference.
 *
 * Usage:
 *   @codestart
 *   let a = [1, 2, 3];
 *   let b = move(a, 0, 2);
 *
 *   assert.deepEqual(a, [1, 2, 3]);
 *   assert.deepEqual(b, [2, 3, 1]);
 *   @codeend
 *
 * @param {Array} array An array object
 * @param {Number} start Index of the element that will be moved
 * @param {Number} end Index at which element will be moved
 * @return {Array} The modified array
 */
function move(array, start, end) {
  var copy = array.slice(0);
  var item = copy.splice(start, 1)[0];
  copy.splice(end, 0, item);
  return copy;
}

/**
 * @module {Module} templatesList <templates-list>
 * @parent api-components
 *
 * This component takes care of displaying a list of templates created by the
 * logged in user.
 *
 * ## Use
 *
 * @codestart
 * <templates-list is-draggable="true" templates="{templates}">
 * </templates-list>
 * @codeend
 */


/**
 * @property {can.Map} templatesList.ViewModel
 * @parent templatesList
 *
 * `<templates-list>`'s viewModel.
 */
export let List = Map.extend({
  define: {
    isDraggable: {
      value: true
    },

    itemTransitionTime: {
      type: 'number',
      value: 1000
    }
  },

  updateSortOrder() {
    let templates = this.attr('templates');
    let dragPos = this.attr('dragItemIndex');
    let dropPos = this.attr('dropItemIndex');

    if (dragPos !== dropPos) {
      can.batch.start();

      let positions = _range(templates.attr('length'));
      let newPositions = move(positions, dragPos, dropPos);

      newPositions.forEach(function(pos, index) {
        templates.attr(pos).attr('buildOrder', index + 1);
      });

      can.batch.stop();

      // since the list is sorted automatically when it's mutated
      // we need to keep track of the current index of the dragged
      // template to move it properly while it is dragged.
      this.attr('dragItemIndex', dropPos);
    }
  }
});

export default Component.extend({
  template,
  viewModel: List,
  leakScope: false,
  tag: 'templates-list',

  events: {
    'li dragstart': function(el, evt) {
      let dt = evt.originalEvent.dataTransfer;

      dt.effectAllowed = 'move';
      dt.setData('text/html', null);

      this.viewModel.attr('dragItemIndex', el.index());
    },

    'li dragenter': function(el) {
      let dropIndex = this.viewModel.attr('dropItemIndex');

      // dragenter is fired multiple times, we need to make sure the class is
      // only added when `dropItemIndex` is different from the element's index
      // that receives the dragenter event; the first condition makes sure the
      // class is added for the element being dragged.
      if (dropIndex == null && dropIndex !== el.index()) {
        el.addClass('drag-placeholder');
      }

      this.viewModel.attr('dropItemIndex', el.index());
    },

    'li dragleave': function(el) {
      let dropIndex = this.viewModel.attr('dropItemIndex');

      // similar to dragenter, this event is fired multiple times, we only
      // remove the class when the 'leaved' element's index is different from
      // the position where the dragged element might be dropped (`dropItemIndex`).
      if (dropIndex !== el.index()) {
        el.removeClass('drag-placeholder');
      }
    },

    'li dragover': function(el, evt) {
      evt.preventDefault();

      let dt = evt.originalEvent.dataTransfer;
      dt.dropEffect = 'move';
    },

    // this event won't be dispatched if the source node is moved during the
    // drag, causing the placeholder to stay visible after the elemet has been
    // dropped.
    'li dragend': function(el) {
      el.removeClass('drag-placeholder');

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      });
    },

    // we stop the propagation of this event to avoid the listener on the
    // document to execute when the one at the list item has been executed.
    'li drop': function(el, evt) {
      evt.stopPropagation();
      el.removeClass('drag-placeholder');

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      });
    },

    // to workaround the issue with the `dragend` event not being dispatched,
    // we have to make the document a valid drop target, in order to do that
    // we need to set listeners for `dragstart` and `dragover` events.
    '{document} dragstart': function() {},

    '{document} dragover': function(el, evt) {
      evt.preventDefault();
    },

    // if a template is not being droppped within the boundaries of one the
    // items, we need to make sure the placeholder class is removed anyways,
    // the dragged item will remain at its last valid position.
    '{document} drop': function(el, evt) {
      evt.preventDefault();
      this.element.find('li').removeClass('drag-placeholder');
    },

    '{viewModel} dropItemIndex': function() {
      this.viewModel.updateSortOrder();
    }
  }
});

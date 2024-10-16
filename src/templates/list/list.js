import CanMap from 'can-map'
import _range from 'lodash/range'
import template from './list.stache'
import Component from 'can-component'
import moveItem from 'a2jauthor/src/utils/move-item-array'
import queues from 'can-queues'

import 'can-map-define'

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
export const List = CanMap.extend({
  define: {
    activeFilter: {
      serialize: false
    },
    isDraggable: {
      value: true
    },

    itemTransitionTime: {
      type: 'number',
      value: 1000
    },

    hasSorted: {}
  },

  updateSortOrder () {
    const displayList = this.attr('displayList')
    const dragPos = this.attr('dragItemIndex')
    const dropPos = this.attr('dropItemIndex')

    if (dragPos !== dropPos) {
      queues.batch.start()

      const positions = _range(displayList.attr('length'))
      const newPositions = moveItem(positions, dragPos, dropPos)

      newPositions.forEach(function (pos, index) {
        const template = displayList.attr(pos)
        template.attr('buildOrder', index + 1)
      })

      queues.batch.stop()
      // since the list is sorted automatically when it's mutated
      // we need to keep track of the current index of the dragged
      // template to move it properly while it is dragged.
      this.attr('dragItemIndex', dropPos)

      // tell templates viewModel the list has sorted to update
      // and save the unfiltered list order
      this.attr('hasSorted', true)
    }
  }
})

export default Component.extend({
  view: template,
  ViewModel: List,
  leakScope: false,
  tag: 'templates-list',

  events: {
    'li dragstart': function (el, evt) {
      el = $(el)
      const dt = evt.dataTransfer

      dt.effectAllowed = 'move'
      dt.setData('text/html', null)

      this.viewModel.attr('dragItemIndex', el.index())
    },

    'li dragenter': function (el) {
      el = $(el)
      const dropIndex = this.viewModel.attr('dropItemIndex')

      // add placeholder class to the element being dragged.
      if (dropIndex == null) {
        el.addClass('drag-placeholder')
      }

      this.viewModel.attr('dropItemIndex', el.index())
    },

    'li dragleave': function (el) {
      el = $(el)
      const dropIndex = this.viewModel.attr('dropItemIndex')

      // similar to dragenter, this event is fired multiple times, we only
      // remove the class when the 'leaved' element's index is different from
      // the position where the dragged element might be dropped (`dropItemIndex`).
      if (dropIndex !== el.index()) {
        el.removeClass('drag-placeholder')
      }
    },

    'li dragover': function (el, evt) {
      evt.preventDefault()

      const dt = evt.dataTransfer
      dt.dropEffect = 'move'
    },

    // this event won't be dispatched if the source node is moved during the
    // drag, causing the placeholder to stay visible after the elemet has been
    // dropped.
    'li dragend': function (el) {
      el = $(el)
      el.removeClass('drag-placeholder')

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      })
    },

    // we stop the propagation of this event to avoid the listener on the
    // document to execute when the one at the list item has been executed.
    'li drop': function (el, evt) {
      el = $(el)
      evt.stopPropagation()
      el.removeClass('drag-placeholder')

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      })
    },

    // to workaround the issue with the `dragend` event not being dispatched,
    // we have to make the document a valid drop target, in order to do that
    // we need to set listeners for `dragstart` and `dragover` events.
    '{document} dragstart': function () {},

    '{document} dragover': function (el, evt) {
      evt.preventDefault()
    },

    // if a template is not being droppped within the boundaries of one the
    // items, we need to make sure the placeholder class is removed anyways,
    // the dragged item will remain at its last valid position.
    '{document} drop': function (el, evt) {
      evt.preventDefault()
      $(this.element).find('li').removeClass('drag-placeholder')
    },

    '{viewModel} dropItemIndex': function () {
      this.viewModel.updateSortOrder()
    },

    '{viewModel} activeFilter': function () {
      this.viewModel.updateSortOrder()
    }
  }
})

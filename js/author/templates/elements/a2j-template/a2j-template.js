import Component from 'can-component'
import template from './a2j-template.stache'
import A2JTemplateVM from './a2j-template-vm'

export default Component.extend({
  view: template,
  tag: 'a2j-template',
  ViewModel: A2JTemplateVM,

  events: {
    click: function (_, evt) {
      evt.stopPropagation()
    },

    'li dragstart': function (el, evt) {
      evt.stopPropagation()
      let $el = $(el)
      let dt = evt.dataTransfer
      dt.effectAllowed = 'move'
      dt.setData('text/html', null)
      this.viewModel.attr('dragItemIndex', $el.index())
      $(this.element).find('element-options-pane').hide()
    },

    'li dragenter': function (el, evt) {
      evt.stopPropagation()
      let $el = $(el)
      let dropIndex = this.viewModel.attr('dropItemIndex')

      // add placeholder class to the dragged element (dropIndex is null) and
      // when the element receiving the dragenter event is at a different index
      // than the dragged element (dragenter is fired multiple times).
      if (dropIndex == null || (dropIndex != null && dropIndex !== $el.index())) {
        this.viewModel.setDragPlaceholderFlag()
      }
    },

    'li dragover': function ($el, evt) {
      evt.preventDefault()

      let dt = evt.dataTransfer
      dt.dropEffect = 'move'
    },

    // this event won't be dispatched if the source node is moved during the
    // drag, causing the placeholder to stay visible after the elemet has been
    // dropped.
    'li dragend': function () {
      this.viewModel.removeDragPlaceholderFlag()

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      })
    },

    'li drop': function (el, evt) {
      evt.stopPropagation()
      this.viewModel.removeDragPlaceholderFlag()

      let $el = $(el)
      this.viewModel.attr('dropItemIndex', $el.index())

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      })
    },

    // to workaround the issue with the `dragend` event not being dispatched,
    // we have to make the document a valid drop target, in order to do that
    // we need to set listeners for `dragstart` and `dragover` events.
    '{document} dragstart': function () {},

    '{document} dragover': function ($el, evt) {
      evt.preventDefault()
      this.viewModel.removeDragPlaceholderFlag()
    },

    // if a template is not being droppped within the boundaries of one the
    // items, we need to make sure the placeholder class is removed anyways,
    // the dragged item will remain at its last valid position.
    '{document} drop': function ($el, evt) {
      evt.preventDefault()
      this.viewModel.removeDragPlaceholderFlag()
    },

    '{viewModel} dropItemIndex': function () {
      let vm = this.viewModel
      vm.updateChildrenOrder()
    },

    // need to figure out why 2-way binding this variable from a parent
    // component does not update the parent bound property.
    '{viewModel} selectedNode': function (vm, evt, selectedNode) {
      $(this.element).trigger('node-selected', selectedNode)
    }
  },

  leakScope: true
})

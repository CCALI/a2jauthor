import stache from 'can/view/stache/';
import Component from 'can/component/';
import A2JNode from 'author/models/a2j-node';
import template from './a2j-template.stache!';
import A2JTemplateVM from './a2j-template-vm';

import 'author/alert/';
import './a2j-template.less!';
import 'author/templates/elements/free-form/';
import 'author/templates/elements/a2j-variable/';
import 'author/templates/elements/section-title/';

export default Component.extend({
  template,
  tag: 'a2j-template',
  viewModel: A2JTemplateVM,

  helpers: {
    a2jParse(component, state) {
      component = component.isComputed ? component() : component;
      state = state.isComputed ?  state() : state;

      state.attr('editEnabled', this.attr('editEnabled'));

      return stache(component)(state);
    }
  },

  events: {
    'li dragstart': function($el, evt) {
      let $handle = $el.find('.drag-handle');

      if ($handle.length) {
        let dt = evt.originalEvent.dataTransfer;
        dt.effectAllowed = 'move';
        dt.setData('text/html', null);
        this.viewModel.attr('dragItemIndex', $el.index());
        this.element.find('element-options-pane').hide();
      } else {
        evt.preventDefault();
      }
    },

    'li dragenter': function($el) {
      let dropIndex = this.viewModel.attr('dropItemIndex');

      // add placeholder class to the dragged element (dropIndex is null) and
      // when the element receiving the dragenter event is at a different index
      // than the dragged element (dragenter is fired multiple times).
      if (dropIndex == null || (dropIndex != null && dropIndex !== $el.index())) {
        this.viewModel.setDragPlaceholderFlag();
      }

      this.viewModel.attr('dropItemIndex', $el.index());
    },

    'li dragover': function($el, evt) {
      evt.preventDefault();

      let dt = evt.originalEvent.dataTransfer;
      dt.dropEffect = 'move';
    },

    // this event won't be dispatched if the source node is moved during the
    // drag, causing the placeholder to stay visible after the elemet has been
    // dropped.
    'li dragend': function($el) {
      this.viewModel.removeDragPlaceholderFlag();
      this.element.find('element-options-pane').show();

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      });
    },

    'li drop': function($el, evt) {
      evt.stopPropagation();
      this.viewModel.removeDragPlaceholderFlag();

      this.viewModel.attr({
        dragItemIndex: null,
        dropItemIndex: null
      });
    },

    // to workaround the issue with the `dragend` event not being dispatched,
    // we have to make the document a valid drop target, in order to do that
    // we need to set listeners for `dragstart` and `dragover` events.
    '{document} dragstart': function() {},

    '{document} dragover': function($el, evt) {
      evt.preventDefault();
    },

    // if a template is not being droppped within the boundaries of one the
    // items, we need to make sure the placeholder class is removed anyways,
    // the dragged item will remain at its last valid position.
    '{document} drop': function($el, evt) {
      evt.preventDefault();
      this.viewModel.removeDragPlaceholderFlag();
    },

    '{viewModel} dropItemIndex': function() {
      let vm = this.viewModel;
      vm.updateChildrenOrder();
    }
  }
});

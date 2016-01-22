import stache from 'can/view/stache/';
import Component from 'can/component/';
import template from './a2j-template.stache!';
import A2JTemplateVM from './a2j-template-vm';

const tagToComponentMap = {
  'a2j-rich-text': '<a2j-rich-text state="{.}" />',
  'a2j-page-break': '<a2j-page-break state="{.}" />',
  'a2j-repeat-loop': '<a2j-repeat-loop state="{.}" />',
  'a2j-conditional': '<a2j-conditional state="{.}" />',
  'a2j-section-title': '<a2j-section-title state="{.}" />'
};

export default Component.extend({
  template,
  tag: 'a2j-template',
  viewModel: A2JTemplateVM,

  helpers: {
    a2jParse(tag, state, index) {
      index = index.isComputed ? index() : index;
      let component = tagToComponentMap[tag];

      can.batch.start();

      state.attr('nodeIndex', index);
      state.attr('guide', this.attr('guide'));
      state.attr('answers', this.attr('answers'));
      state.attr('useAnswers', this.attr('useAnswers'));
      state.attr('editEnabled', this.attr('editEnabled'));

      can.batch.stop();

      return stache(component)(state);
    }
  },

  events: {
    click: function(_, evt) {
      evt.stopPropagation();
    },

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
    'li dragend': function() {
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
    },

    // This event is fired by elements that own `a2j-template` instances (they
    // have nested elements, e.g a2j-conditional); when those nested elements are
    // selected by the user the event is triggered so parent `a2j-template` can
    // deselect it's top level nodes.
    'nested-node-selected': function($el, evt, nodeVM) {
      let vm = this.viewModel;
      let nodesViewModels = vm.attr('nodesViewModels');

      nodesViewModels.each(function(node) {
        if (node !== nodeVM) {
          node.attr('editActive', false);
        }
      });
    }
  }
});

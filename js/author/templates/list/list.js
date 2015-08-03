import Map from 'can/map/';
import template from './list.stache!';
import Component from 'can/component/';
import debounce from 'lodash/function/debounce';

import './item/';
import './list.less!';
import 'can/map/define/';

/**
 * @module {Module} author/templates/list/
 * @parent api-components
 *
 * Provides the view model and component constructors for the `<templates-list>`
 * custom tag, which takes care of displaying a list of templates created by the
 * logged in user.
 */


/**
 * @function TemplatesListViewModel
 * Constructor function used as the `viewModel` of the `<templates-list>` component.
 */
export let List = Map.extend({
  define: {
    isDraggable: {
      value: true
    }
  },

  updateSortOrder() {
    let dragPos = this.attr('dragItemIndex');
    let dropPos = this.attr('dropItemIndex');
    let templates = this.attr('templates').attr();

    if (dragPos !== dropPos) {
      // swap the item being dragged to the current dragover position.
      let temp = templates[dragPos];
      templates[dragPos] = templates[dropPos];
      templates[dropPos] = temp;

      // since the list is sorted automatically when it's mutated
      // we need to keep track of the current index of the dragged
      // template to move it properly while it is dragged.
      this.attr('dragItemIndex', dropPos);

      // Once the templates are placed at the right indexes, we
      // need to fix the build order
      templates.forEach(function(template, index) {
        template.buildOrder = index + 1;
      });

      // finally replace the sorted template to update the UI.
      this.attr('templates').replace(templates);
    }
  }
});

/**
 * @function TemplatesListComponent
 * Constructor function that defines the custom `<templates-list>` tag behavior.
 */
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

      this.viewModel.attr('dragItemIndex', el.data('index'));
    },

    'li dragenter': function(el) {
      el.addClass('drag-placeholder');

      this.viewModel.attr('dropItemIndex', el.data('index'));
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
    },

    // we stop the propagation of this event to avoid the listener on the
    // document to execute when the one at the list item has been executed.
    'li drop': function(el, evt) {
      evt.stopPropagation();
      el.removeClass('drag-placeholder');
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
      let debounced = debounce(this.viewModel.updateSortOrder, 100);
      debounced.call(this.viewModel);
    }
  }
});

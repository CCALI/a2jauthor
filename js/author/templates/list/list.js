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
    let finalPos = this.attr('finalItemIndex');
    let initialPos = this.attr('initialItemIndex');
    let templates = this.attr('templates').attr();

    if (initialPos !== finalPos) {
      // swap the item being dragged to the current dragover position.
      let temp = templates[initialPos];
      templates[initialPos] = templates[finalPos];
      templates[finalPos] = temp;

      // since the list is sorted automatically when it's mutated
      // we need to keep track of the current index of the dragged
      // template to move it properly while it is dragged.
      this.attr('initialItemIndex', finalPos);

      // Once the templates are place at the right indexes, we
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

      this.viewModel.attr('initialItemIndex', el.data('index'));
    },

    'li dragenter': function(el) {
      this.viewModel.attr('finalItemIndex', el.data('index'));
    },

    'li dragover': function(el, evt) {
      let dt = evt.originalEvent.dataTransfer;
      evt.preventDefault();

      dt.dropEffect = 'move';
      el.addClass('drag-placeholder');
    },

    'li dragend': function(el) {
      el.removeClass('drag-placeholder');
    },

    'li drop': function(el) {
      el.removeClass('drag-placeholder');
    },

    '{viewModel} finalItemIndex': function() {
      let debounced = debounce(this.viewModel.updateSortOrder, 100);
      debounced.call(this.viewModel);
    }
  }
});

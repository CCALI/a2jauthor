import Map from 'can/map/';
import items from './navbar-items';
import Component from 'can/component/';
import template from './vertical-navbar.stache!';

import 'can/map/define/';
import './vertical-navbar.less!';

export let VerticalNavbar = Map.extend({
  define: {
    items: {
      value: items
    },

    theme: {
      type: 'string',
      value: 'default',
      set(val) {
        if (val !== 'default' && val !== 'inverse') {
          return 'default';
        }

        return val;
      }
    },

    position: {
      type: 'string',
      value: 'left',
      set(val) {
        if (val !== 'left' && val !== 'right') {
          return 'left';
        }

        return val;
      }
    }
  },

  setPage: function(item) {
    this.attr('page', item.attr('page'));
  }
});

/**
 * @module {function} components/vertical-navbar/ <vertical-navbar>
 * @parent api-components
 * @signature `<vertical-navbar>`
 *
 * Global app navigation, fixed to the left or right side of the browser window.
 */
export default Component.extend({
  template,
  tag: 'vertical-navbar',
  viewModel: VerticalNavbar
});

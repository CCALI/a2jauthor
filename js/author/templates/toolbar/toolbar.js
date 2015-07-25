import Map from 'can/map/';
import Component from 'can/component/';
import template from './toolbar.stache!';

import './toolbar.less!';
import 'can/map/define/';

export let Toolbar = Map.extend({
  define: {
    filter: {
      type: 'string'
    }
  },

  setFilter(filter) {
    this.attr('filter', filter);
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: Toolbar,
  tag: 'templates-toolbar'
});

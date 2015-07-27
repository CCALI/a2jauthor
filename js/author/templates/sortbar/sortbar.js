import Map from 'can/map/';
import Component from 'can/component/';
import template from './sortbar.stache!';

import 'can/list/sort/';
import './sortbar.less!';
import 'can/map/define/';

export let Sortbar = Map.extend({
  define: {
    criteria: {
      value: {}
    }
  },

  isSortedBy(key) {
    return this.attr('criteria.key') === key;
  },

  toggleDirection(direction) {
    return direction === 'asc' ? 'desc' : 'asc';
  },

  setSortCriteria(key) {
    let direction = 'asc';

    if (this.isSortedBy(key)) {
      direction = this.toggleDirection(this.attr('criteria.direction'));
    }

    this.attr('criteria', {key, direction});
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: Sortbar,
  tag: 'templates-sortbar'
});

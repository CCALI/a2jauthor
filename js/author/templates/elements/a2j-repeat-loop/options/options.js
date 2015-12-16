import Map from 'can/map/';
import Component from 'can/component/';
import template from './options.stache!';

import 'can/map/define/';

let RepeatLoopOptionsVM = Map.extend({
  define: {
    loopCounter: {
      set(value) {
        return value < 1 ? 1 : value;
      }
    }
  },

  addColumn() {
    let columns = this.attr('tableColumns');
    let newLength = columns.attr('length') + 1;
    let colWidth = Math.floor(100 / newLength);

    columns.each(function(col) {
      col.attr('width', colWidth);
    });

    columns.push({
      variable: '',
      width: colWidth,
      column: `Column ${newLength}`
    });
  },

  removeColumn(index) {
    let columns = this.attr('tableColumns');
    let newLength = columns.attr('length') - 1;
    let colWidth = Math.floor(100 / newLength);

    columns.each(function(col) {
      col.attr('width', colWidth);
    });

    columns.splice(index, 1);
  }
});

export default Component.extend({
  template,
  tag: 'a2j-repeat-loop-options',
  viewModel: RepeatLoopOptionsVM
});

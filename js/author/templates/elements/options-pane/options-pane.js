import Map from 'can/map/';
import Component from 'can/component/';
import template from './options-pane.stache!';

import 'can/map/define/';
import './options-pane.less!';

export let OptionsPane = Map.extend({
  define: {
    title: {
      type: 'string',
      value: ''
    }
  },

  saveAndClose() {
    let nodeScope = this.attr('parentScope');

    if (nodeScope) {
      let rootNodeScope = nodeScope.attr('rootNodeScope');
      rootNodeScope.updateNodeState(nodeScope);
    }
  }
});

export default Component.extend({
  template,
  tag: 'element-options-pane',

  viewModel: function(attrs, parentScope) {
    let vm = new OptionsPane(attrs);
    vm.attr('parentScope', parentScope.attr('.'));
    return vm;
  }
});

import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import template from './debug-panel.stache!';

import 'can/map/define/';

let DebugPanelVM = Map.extend({
  define: {
    variables: {
      get() {
        let interview = this.attr('interview');

        return interview
          ? interview.attr('variablesList')
          : new List([]);
      }
    }
  }
});

export default Component.extend({
  template,
  viewModel: DebugPanelVM,
  tag: 'author-debug-panel',

  events: {
    '#clearTrace click': function() {
      this.element.find('#tracer').empty();
    }
  }
})

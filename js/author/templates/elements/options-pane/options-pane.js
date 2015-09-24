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
  }
});

export default Component.extend({
  template,
  tag: 'element-options-pane',
  viewModel: OptionsPane
});

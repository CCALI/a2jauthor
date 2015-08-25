import Map from 'can/map/';
import Component from 'can/component/';
import template from './elements.stache!';

import './blank/';
import 'can/map/define/';
import './elements.less!';
import './element-container/';

export let Elements = Map.extend({
  define: {
    elements: {
      value: []
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: Elements,
  tag: 'template-elements'
});

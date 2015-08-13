import Map from 'can/map/';
import Component from 'can/component/';
import template from './elements.stache!';

import './blank/';
import 'can/map/define/';
import './elements.less!';

export let Elements = Map.extend({
  define: {
    elements: {
      value: []
    }
  }
});

export default Component.extend({
  template,
  viewModel: Elements,
  tag: 'template-elements'
});

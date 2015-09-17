import Map from 'can/map/';
import Component from 'can/component/';
import template from './section-title.stache!';

import './section-title.less!';
import '../element-container/';

export let SectionTitleVM = Map.extend({
  define: {
    selected: {
      value: false
    }
  }
});

export default Component.extend({
  template,
  tag: 'section-title',
  viewModel: function(attrs) {
    return new SectionTitleVM(attrs.state);
  }
});

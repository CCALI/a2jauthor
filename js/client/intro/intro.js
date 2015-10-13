import Map from 'can/map/';
import Component from 'can/component/';
import template from './intro.stache!';

import 'jquerypp/event/swipe/';

let IntroVM = Map.extend({
  navigate: function(button) {
    this.attr('rState').attr({
      page: this.attr('interview.firstPage'),
      view: 'pages'
    });
  }
});

export default Component.extend({
  template,
  tag: 'a2j-intro',
  viewModel: IntroVM,

  events: {
    inserted() {
      this.viewModel.attr('mState.header', '');
      this.viewModel.attr('mState.step', '');
    }
  }
});

import stache from 'can/view/stache/';
import Component from 'can/component/';
import template from './free-form.stache!';

import '../element-container/';

export default Component.extend({
  template,
  tag: 'free-form',
  events: {
    inserted($el) {
      let viewModel = this.viewModel;
      let state = viewModel.attr('state');
      let renderer = stache(state.attr('userContent'));

      $el.find('content').replaceWith(renderer(state));
    }
  }
});

import Component from 'can/component/';
import stache from 'can/view/stache/';

export default Component.extend({
  tag: 'free-form',
  events: {
    inserted: function($element) {
      let viewModel = this.viewModel;
      let state = viewModel.attr('state');
      let renderer = stache(state.attr('userContent'));
      $element.append(renderer(state));
    }
  }
});

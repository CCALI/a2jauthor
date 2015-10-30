import Map from 'can/map/';
import Component from 'can/component/';
import template from './preview.stache!';

import 'can/map/define/';

let AuthorPreview = Map.extend({
  define: {
    previewMode: {
      value: false
    }
  }
});

export default Component.extend({
  template,
  tag: 'author-preview',
  viewModel: AuthorPreview,

  events: {
    inserted() {
      if (window.gGuide) {
        this.viewModel.attr('previewMode', true);
      }
    }
  }
});

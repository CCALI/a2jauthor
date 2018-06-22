import CanMap from "can-map";
import Component from "can-component";
import template from './demo.stache';

import "can-map-define";

let AvatarDemoVM = CanMap.extend({
  define: {
    gender: {
      value: 'female'
    },

    facing: {
      value: 'left'
    },

    skin: {
      value: 'light'
    }
  }
});

export default Component.extend({
  view: template,
  viewModel: AvatarDemoVM,
  tag: 'a2j-viewer-avatar-demo',
  leakScope: true
});

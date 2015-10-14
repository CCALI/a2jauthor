import Component from 'can/component/';
import template from './component.stache!';

export default Component.extend({
  template,
  tag: 'a2j-desktop-viewer',

  events: {
    inserted() {
      System.import('viewer/src/');
    }
  }
});

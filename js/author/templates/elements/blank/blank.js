import Component from 'can/component/';
import template from './blank.stache!';

export default Component.extend({
  template,
  leakScope: false,
  tag: 'blank-element'
});

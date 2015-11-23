import Component from 'can/component/';
import template from './footer.stache!';

export default Component.extend({
  template,
  leakScope: false,
  tag: 'app-footer'
});

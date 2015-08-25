import Component from 'can/component/';
import template from './blank.stache!';

import './blank.less!';

export default Component.extend({
  template,
  leakScope: false,
  tag: 'blank-element'
});

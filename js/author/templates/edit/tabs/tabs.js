import Component from 'can/component/';
import template from './tabs.stache!';

import 'bit-tabs';
import './tabs.less!';

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-tabs'
});

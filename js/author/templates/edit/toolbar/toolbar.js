import Component from 'can/component/';
import template from './toolbar.stache!';

import './toolbar.less!';

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-toolbar'
});

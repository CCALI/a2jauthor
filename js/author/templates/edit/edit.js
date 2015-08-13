import Map from 'can/map/';
import Component from 'can/component/';
import template from './edit.stache!';
import Template from 'author/models/template';

import './tabs/';
import './toolbar/';
import './edit.less!';
import 'author/loading/';
import 'can/map/define/';

export let TemplateEditPage = Map.extend({
  define: {
    template: {
      get() {
        let id = this.attr('templateId');
        return Template.findOne({id});
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'template-edit-page'
});

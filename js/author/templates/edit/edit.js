import Map from 'can/map/';
import Component from 'can/component/';
import template from './edit.stache!';
import A2JTemplate from 'author/models/a2j-template';

import './tabs/';
import './toolbar/';
import '../elements/';
import './edit.less!';
import 'author/loading/';
import 'can/map/define/';

export let TemplateEditPage = Map.extend({
  define: {
    a2jTemplate: {
      value() {
        let id = can.route.attr('id');

        if(id === 'new') {
          return new A2JTemplate();
        }
        else {
          return A2JTemplate.findOne({id});
        }
      }
    }
  }
});

export default Component.extend({
  tag: 'template-edit-page',
  leakScope: false,
  viewModel: TemplateEditPage,
  template
});

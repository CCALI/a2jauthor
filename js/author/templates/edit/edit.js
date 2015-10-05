import Map from 'can/map/';
import Component from 'can/component/';
import template from './edit.stache!';
import A2JTemplate from 'author/models/a2j-template';

import './tabs/';
import './toolbar/';
import './edit.less!';
import 'author/loading/';
import 'can/map/define/';
import '../elements/blank/';

export let TemplateEditPage = Map.extend({
  define: {
    a2jTemplatePromise: {
      get() {
        let promise;
        let id = this.attr('templateId');

        if (id === 'new') {
          promise = Promise.resolve(new A2JTemplate());
        } else {
          promise = A2JTemplate.findOne({template_id: id});
        }

        promise = promise.then(a2jTemplate => {
          this.attr('a2jTemplate', a2jTemplate);
          return a2jTemplate;
        });

        return promise;
      }
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-page',
  viewModel: TemplateEditPage
});

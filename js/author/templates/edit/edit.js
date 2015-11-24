import Map from 'can/map/';
import Component from 'can/component/';
import template from './edit.stache!';
import A2JTemplate from 'author/models/a2j-template';

import 'can/map/define/';

export let TemplateEditPage = Map.extend({
  define: {
    a2jTemplatePromise: {
      get() {
        let templateId = this.attr('templateId');

        let promise = templateId === 'new'
          ? Promise.resolve(new A2JTemplate())
          : A2JTemplate.findOne({templateId});

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

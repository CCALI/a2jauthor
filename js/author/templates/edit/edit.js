import Map from 'can/map/';
import Component from 'can/component/';
import template from './edit.stache!';
import A2JTemplate from 'author/models/a2j-template';

import 'can/map/define/';

export let TemplateEditPageVM = Map.extend({
  define: {
    a2jTemplatePromise: {
      get() {
        let promise;
        let templateId = this.attr('templateId');

        if (templateId === 'new') {
          promise = Promise.resolve(new A2JTemplate());
        } else {
          promise = A2JTemplate.findOne({templateId});
        }

        return promise.then(a2jTemplate => {
          this.attr('a2jTemplate', a2jTemplate);
          return a2jTemplate;
        });
      }
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-page',
  viewModel: TemplateEditPageVM
});

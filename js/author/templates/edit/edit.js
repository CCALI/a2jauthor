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
        let guideId = window.gGuideID;

        if (templateId === 'new') {
          promise = Promise.resolve(new A2JTemplate({
            guideId: guideId
          }));
        } else {
          promise = A2JTemplate.findOne({templateId});
        }

        return promise;
      }
    },

    a2jTemplate: {
      get(last, set) {
        return this.attr('a2jTemplatePromise').then(set);
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

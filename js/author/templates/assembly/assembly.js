import Map from 'can/map/';
import Component from 'can/component/';
import template from './assembly.stache!';
import A2JTemplate from 'author/models/a2j-template';

import 'can/map/define/';

export let TemplateAssembly = Map.extend({
  define: {
    templates: {
      get(currentValue, setValue) {
        let guideId = this.attr('guideId');
        let templateId = this.attr('templateId');

        if (templateId) {
          A2JTemplate.findOne({templateId}).then(setValue);
        } else if (guideId) {
          A2JTemplate.findAll({guideId}).then(setValue);
        }
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'template-assembly',
  viewModel: TemplateAssembly
});

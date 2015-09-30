import Map from 'can/map/';
import Component from 'can/component/';
import template from './assembly.stache!';
import A2JTemplate from 'author/models/a2j-template';

import 'can/map/define/';

export let TemplateAssembly = Map.extend({
  define: {
    templates: {
      get(currentValue, setValue) {
        let guideId = this.attr('guideId') || window.gGuideID;
        let templateId = this.attr('templateId');

        if(templateId) {
          A2JTemplate.findOne({ template_id: templateId }).then(setValue);
        }
        else if(guideId) {
          A2JTemplate.findAll({ guide_id: guideId}).then(setValue);
        }
      }
    }
  }
});

export default Component.extend({
  tag: 'template-assembly',
  viewModel: TemplateAssembly,
  template
});

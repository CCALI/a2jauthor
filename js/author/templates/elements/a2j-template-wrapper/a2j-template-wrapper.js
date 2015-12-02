import Map from 'can/map/';
import Component from 'can/component/';
import template from './a2j-template-wrapper.stache!';
import A2JTemplate from 'caja/author/models/a2j-template';

import 'can/map/define/';

/**
 * @module {Module} author/templates/elements/a2j-template-wrapper/ <a2j-template-wrapper>
 * @parent api-components
 *
 * This component is used server side, to wrap `<a2j-template>`, it converts the
 * serialized template received from the client into an instance of the
 * A2JTemplate model used by `<a2j-template>` for rendering purposes.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-template-wrapper {(template)}="request.body.template" />
 * @codeend
 */

/**
 * @property {can.Map} templateWrapper.ViewModel
 * @parent author/templates/elements/a2j-template-wrapper/
 *
 * <a2j-template-wrapper>'s viewModel.
 */
let TemplateWrapperVM = Map.extend({
  define: {
    /**
     * @property {A2JTemplate} templateWrapper.ViewModel.prototype.define.parsedTemplate parsedTemplate
     * @parent templateWrapper.ViewModel
     *
     * This is an A2JTemplate instance created from the template object sent by
     * the client.
     */
    parsedTemplate: {
      get() {
        let tplString = this.attr('template');

        if (tplString) {
          return new A2JTemplate(JSON.parse(tplString));
        }
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-template-wrapper',
  viewModel: TemplateWrapperVM
});

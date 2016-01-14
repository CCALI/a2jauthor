import Map from 'can/map/';
import Component from 'can/component/';
import Answers from 'caja/author/models/answers';
import template from './a2j-template-wrapper.stache!';
import A2JTemplate from 'caja/author/models/a2j-template';

import 'can/map/define/';

/**
 * @module {Module} author/templates/elements/a2j-template-wrapper/ <a2j-template-wrapper>
 * @parent api-components
 *
 * This component is used server side, to wrap `<a2j-template>`, it converts the
 * serialized payload received from the client to the `templates` and `answers`
 * objects needed to render the PDF document.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-template-wrapper {payload}="request.body.payload" />
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
     * @property {can.Map} templateWrapper.ViewModel.prototype.payload payload
     * @parent templateWrapper.ViewModel
     *
     * JSON payload sent by the client, it should include both `answers` and
     * `templates` properties.
     */
    payload: {
      set(json) {
        let result = {answers: {}, templates: []};

        try {
          result = JSON.parse(json);
        } catch (e) {
          console.error('Invalid JSON', e);
        }

        return new Map(result);
      }
    },

    /**
     * @property {A2JTemplate.List} templateWrapper.ViewModel.prototype.templates templates
     * @parent templateWrapper.ViewModel
     *
     * List of A2JTemplate instances extracted from the [payload].
     */
    templates: {
      get() {
        let payload = this.attr('payload');

        return new A2JTemplate.List(payload.attr('templates'));
      }
    },

    /**
     * @property {Answers} templateWrapper.ViewModel.prototype.answers answers
     * @parent templateWrapper.ViewModel
     *
     * Key/value map of interview's variable values extracted from [payload].
     */
    answers: {
      get() {
        let payload = this.attr('payload');
        let rawAnswers = payload.attr('answers').attr();

        return new Answers(rawAnswers);
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-template-wrapper',
  viewModel: TemplateWrapperVM
});

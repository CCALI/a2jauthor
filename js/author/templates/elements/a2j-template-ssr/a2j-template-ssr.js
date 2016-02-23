import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import Answers from 'caja/author/models/answers';
import template from './a2j-template-ssr.stache!';
import A2JTemplate from 'caja/author/models/a2j-template';

import 'can/map/define/';

/**
 * @module {Module} author/templates/elements/a2j-template-ssr/ <a2j-template-ssr>
 * @parent api-components
 *
 * This component is used server side, to wrap `<a2j-template>`, it retrieves the
 * template(s) needed to generate the document and parses the answers object coming
 * from the client.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-template-wrapper
 *     {answers}="request.body.answers"
 *     {guide-id}="request.body.guideId"
 *     {template-id}="request.body.templateId" />
 * @codeend
 */

/**
 * @property {can.Map} templateSsr.ViewModel
 * @parent author/templates/elements/a2j-template-ssr/
 *
 * <a2j-template-ssr>'s viewModel.
 */
const TemplateSsrVM = Map.extend({
  define: {
    /**
     * @property {Promise} templateSsr.ViewModel.prototype.templatesPromise templatesPromise
     * @parent templateSsr.ViewModel
     *
     * Asynchronous request to retrieve the template(s) needed to generate
     * the PDF if `templateId` is provided, it'll fetch that specific template
     * otherwise it will retrieve the list of templates matching `guideId`.
     */
    templatesPromise: {
      get() {
        const active = true;
        const guideId = this.attr('guideId');
        const templateId = this.attr('templateId');
        const fileDataUrl = this.attr('fileDataUrl');

        return templateId ?
          this.findOneAndMakeList(templateId) :
          A2JTemplate.findAll({ guideId, fileDataUrl, active });
      }
    },

    /**
     * @property {A2JTemplate.List} templateSsr.ViewModel.prototype.templates templates
     * @parent templateSsr.ViewModel
     *
     * List of A2JTemplate instance(s).
     */
    templates: {
      get(last, set) {
        this.attr('templatesPromise').then(set);
      }
    },

    /**
     * @property {Answers} templateSsr.ViewModel.prototype.answers answers
     * @parent templateSsr.ViewModel
     *
     * Key/value map of interview's variable values.
     */
    answers: {
      set(json) {
        const answers = this.parseAnswers(json);
        return new Answers(answers);
      }
    }
  },

  /**
   * @function templateSsr.ViewModel.prototype.findOneAndMakeList findOneAndMakeList
   * @parent templateSsr.ViewModel
   *
   * Calls `A2JTemplate.findOne` with the id value pass as a parameter and
   * returns an `A2JTemplate.List` with the template instance retrieved from
   * the server.
   */
  findOneAndMakeList(id) {
    const promise = A2JTemplate.findOne({ templateId: id });
    return promise.then(template => new List([template]));
  },

  /**
   * @function templateSsr.ViewModel.prototype.parseAnswers parseAnswers
   * @parent templateSsr.ViewModel
   *
   * Parses the JSON string coming from the client and returns the resulting
   * object (returns an empty object if invalid json is passed).
   */
  parseAnswers(json) {
    let answers = {};

    try {
      answers = JSON.parse(json);
    }
    catch (e) {
      console.error('Invalid JSON', e);
    }

    return answers;
  }
});

export default Component.extend({
  template,
  tag: 'a2j-template-ssr',
  viewModel: TemplateSsrVM
});

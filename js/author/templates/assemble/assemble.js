import Map from 'can/map/';
import _keys from 'lodash/keys';
import Component from 'can/component/';
import template from './assemble.stache!';
import parser from 'caja/viewer/mobile/util/parser';

import 'can/map/define/';

/**
 * @module {Module} author/templates/assemble/ <test-assemble-options>
 * @parent api-components
 *
 * This component is used when user clicks the "Test Assemble" button, it
 * exposes two buttons that allow the author to load an anwers file and/or get
 * a PDF generated out of a single template or of all the templates matching the
 * provided [guideId].
 *
 * ## Use
 *
 * @codestart
 *   <test-assemble-options {guide-id}="guideId" />
 *   <test-assemble-options {guide-id}="guideId" {template-id}="templateId" />
 * @codeend
 */

/**
 * @property {can.Map} assemble.ViewModel
 * @parent author/templates/assemble/
 *
 * <test-assemble-options>'s viewModel.
 */
let AssembleOptionsVM = Map.extend({
  define: {
    /**
     * @property {String} assemble.ViewModel.prototype.guideId guideId
     * @parent assemble.ViewModel
     *
     * The guided interview id.
     *
     * This id is required during document assembly, if [templateId] is not set,
     * the assembly endpoint will generate a document using all of the templates
     * for the logged in author that matches this [guideId].
     */
    guideId: {
      value: ''
    },

    /**
     * @property {String} assemble.ViewModel.prototype.guideTitle guideTitle
     * @parent assemble.ViewModel
     *
     * Guided interview title.
     *
     * This title is displayed in the popup where author is allowed to either
     * upload answers or generate PDF and it's also sent as part of the payload
     * to the document assembly endpoint to be used as the document filename.
     */
    guideTitle: {
      value: ''
    },

    /**
     * @property {String} assemble.ViewModel.prototype.templateId templateId
     * @parent assemble.ViewModel
     *
     * Id of the template to be used during document assembly.
     *
     * This property is optional, and should be set only when you want to
     * generate a PDF document out of a single template, e.g when the author
     * clicks the "Assemble" button in the template edit page, the document
     * should be generated using the template being edited at that moment.
     */
    templateId: {
      value: ''
    },

    /**
     * @property {Answers} assemble.ViewModel.prototype.interviewAnswers interviewAnswers
     * @parent assemble.ViewModel
     *
     * This is a key/value map containing the interview's variable values
     * uploaded by the author.
     */
    interviewAnswers: {
      Value: Map
    },

    /**
     * @property {Boolean} assemble.ViewModel.prototype.hasLoadedAnswers hasLoadedAnswers
     * @parent assemble.ViewModel
     *
     * Whether user has loaded an answers file already.
     */
    hasLoadedAnswers: {
      get() {
        const answers = this.attr('interviewAnswers');
        return _keys(answers.attr()).length > 0;
      }
    },

    /**
     * @property {String} assemble.ViewModel.prototype.answersString answersString
     * @parent assemble.ViewModel
     *
     * JSON representation of `answers` object used to fill in the template during
     * document assembly.
     */
    answersString: {
      get() {
        const answers = this.attr('interviewAnswers');

        return JSON.stringify(answers.serialize());
      }
    }
  },

  clearAnswers() {
    this.attr('interviewAnswers', new Map());
  }
});

export default Component.extend({
  template,
  viewModel: AssembleOptionsVM,
  tag: 'test-assemble-options',

  events: {
    '.load-answers click': function($el, evt) {
      evt.preventDefault();
      this.element.find('.answers-file-input').click();
    },

    '.answers-file-input change': function($el) {
      const vm = this.viewModel;
      const file = $el.get(0).files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function() {
          const answers = parser.parseJSON(reader.result, {});

          if (answers) {
            vm.attr('interviewAnswers', answers);
          }
        };

        reader.readAsText(file);
      }
    }
  }
});

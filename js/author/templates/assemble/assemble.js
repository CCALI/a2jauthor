import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import _keys from 'lodash/object/keys';
import template from './assemble.stache!';
import parser from 'viewer/mobile/util/parser';

import 'can/map/define/';

/**
 * @module {Module} author/templates/assemble/ <test-assemble-options>
 * @parent api-components
 *
 * This component is used when user clicks the "Test Assemble" button, it
 * exposes two buttons that allow the user to load an anwers file and/or get a
 * PDF of the template (or templates) passed as an attribute.
 *
 * ## Use
 *
 * @codestart
 *   <test-assemble-options {template}="a2jTemplate" />
 *   <test-assemble-options {templates}="templatesList" />
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
     * @property {Answers} assemble.ViewModel.prototype.interviewAnswers interviewAnswers
     * @parent assemble.ViewModel
     *
     * This is a key/value map containing the interview's variable values
     * provided by the user through the viewer app.
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
        let answers = this.attr('interviewAnswers');
        return _keys(answers.attr()).length > 0;
      }
    },

    /**
     * @property {can.List} assemble.ViewModel.prototype.templatesList templatesList
     * @parent assemble.ViewModel
     *
     * List of [A2JTemplate] instances used to generate a PDF document. When
     * [template] is provided, the list contains only that template -this covers
     * the use case when user clicks "Test Assemble" button in the template edit
     * page - if user clicks the same button in the templates list page,
     * [templates] is used instead.
     */
    templatesList: {
      get() {
        let list = new List();
        let template = this.attr('template');
        let templates = this.attr('templates');

        if (template) {
          list.push(template);
        } else if (templates) {
          list = templates;
        }

        return list;
      }
    },

    /**
     * @property {String} assemble.ViewModel.prototype.assemblePayload assemblePayload
     * @parent assemble.ViewModel
     *
     * JSON representation of the payload sent to the server to generate the
     * PDF document, which is an object with two properties: `templates` and
     * `answers`.
     */
    assemblePayload: {
      get() {
        let templates = this.attr('templatesList');
        let answers = this.attr('interviewAnswers');

        return JSON.stringify({
          answers: answers.serialize(),
          templates: templates.serialize()
        });
      }
    }
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

    '.clear-answers click': function() {
      this.viewModel.attr('interviewAnswers', new Map());
    },

    '.answers-file-input change': function($el) {
      let vm = this.viewModel;
      let file = $el.get(0).files[0];
      let templates = vm.attr('templatesList');

      if (file && templates) {
        let reader = new FileReader();

        reader.onload = function() {
          let parsedXML = $.parseXML(reader.result);
          let answers = parser.parseJSON(parsedXML, {});

          if (answers) vm.attr('interviewAnswers', answers);
        };

        reader.readAsText(file);
      }
    }
  }
});

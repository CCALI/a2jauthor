import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import template from './assemble.stache!';
import parser from 'viewer/mobile/util/parser';

import 'can/map/define/';

/**
 * @module {Module} author/templates/assemble/ <test-assemble-options>
 * @parent api-components
 *
 * This component is used when user clicks the "Test Assemble" button, it
 * exposes two buttons that allow the user to load an anwers file and/or get a
 * PDF of the template passed as an attribute.
 *
 * ## Use
 *
 * @codestart
 *   <test-assemble-options {template}="a2jTemplate" />
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
     * @property {String} assemble.ViewModel.prototype.serializedTemplates serializedTemplates
     * @parent assemble.ViewModel
     *
     * This is the string representation of a list of [A2JTemplate] instances
     * used to generate a PDF document. When [template] is provided, we create
     * a list of only one template, this covers the use case when user clicks
     * "Test Assemble" button in the template edit page; if user clicks the
     * same button in the templates list page, [templates] is used instead.
     */
    serializedTemplates: {
      get() {
        let list = new List();
        let template = this.attr('template');
        let templates = this.attr('templates');

        if (template) {
          list.push(template);
        } else if (templates) {
          list = templates;
        }

        return JSON.stringify(list.serialize());
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

    '.answers-file-input change': function($el) {
      let file = $el.get(0).files[0];
      let template = this.viewModel.attr('template');

      if (file && template) {
        let reader = new FileReader();

        reader.onload = function() {
          let parsedXML = $.parseXML(reader.result);
          let answers = parser.parseJSON(parsedXML, {});

          // set an aswers propery to the template model instance
          template.attr('answers', answers);
        };

        reader.readAsText(file);
      }
    }
  }
});

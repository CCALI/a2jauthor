import $ from 'jquery';
import Map from 'can/map/';
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
     * @property {String} assemble.ViewModel.prototype.serializedTemplate serializedTemplate
     * @parent assemble.ViewModel
     *
     * This is the string representation of [template] after being serialized,
     * it is used as the value of a hidden input post to the server when user
     * clicks the "Get PDF" button.
     */
    serializedTemplate: {
      get() {
        let template = this.attr('template');
        return JSON.stringify(template.serialize());
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

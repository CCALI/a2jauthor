import loader from '@loader';
import stache from 'can/view/stache/';
import Component from 'can/component/';
import _isNumber from 'lodash/lang/isNumber';
import RepeatLoopVM from './a2j-repeat-loop-vm';
import template from './a2j-repeat-loop.stache!';
import displayTableTpl from './repeat-table.stache!';
import repeatLoopOptionsTpl from './repeat-loop-options.stache!';

import 'can/view/';

can.view.preload('display-table-tpl', displayTableTpl);
can.view.preload('repeat-loop-options-tpl', repeatLoopOptionsTpl);

/**
 * @module {Module} author/templates/elements/a2j-repeat-loop/ <a2j-repeat-loop>
 * @parent api-components
 *
 * This component allows the loop over `repeating` variables and create tables/
 * lists with those values.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-repeat-loop {state}="state" />
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'a2j-repeat-loop',

  viewModel(attrs) {
    return new RepeatLoopVM(attrs.state);
  },

  events: {
    inserted() {
      let vm = this.viewModel;
      let editActive = vm.attr('editActive');
      let editEnabled = vm.attr('editEnabled');
      let displayType = vm.attr('displayType');

      if (editEnabled) {
        loader.import('caja/ckeditor/').then(() => {
          if (displayType === 'text' && editActive) {
            this.initCKEditor();
          }
        });
      }
    },

    '{viewModel} displayType': function() {
      let vm = this.viewModel;
      let editActive = vm.attr('editActive');
      let displayType = vm.attr('displayType');

      if (displayType === 'text' && editActive) {
        this.initCKEditor();
      } else {
        vm.updateLoopRichText();
        vm.destroyEditorInstance();
      }
    },

    '{viewModel} editActive': function() {
      let vm = this.viewModel;
      let editActive = vm.attr('editActive');
      let displayType = vm.attr('displayType');

      if (displayType === 'text' && editActive) {
        this.initCKEditor();
      } else {
        vm.updateLoopRichText();
        vm.destroyEditorInstance();
      }
    },

    'input[name="displayType"] change': function($el) {
      this.viewModel.attr('displayType', $el.val());
    },

    'input[name="tableStyle"] change': function($el) {
      this.viewModel.attr('tableStyle', $el.val());
    },

    initCKEditor() {
      let vm = this.viewModel;

      // wait for the template to be updated, otherwise the `textarea`
      // won't be in the DOM when `ckeditor.replace` is called.
      setTimeout(() => {
        let $textarea = this.element.find('textarea');

        let editor = CKEDITOR.replace($textarea.get(0), {
          extraPlugins: 'a2j-variable',
          extraAllowedContent: {
            'a2j-variable': {
              attributes: ['name']
            }
          }
        });

        vm.attr('ckeditorInstance', editor);
      });
    }
  },

  helpers: {
    a2jParse(templateSnippet, index) {
      let scope = {
        answers: this.attr('answers'),
        useAnswers: this.attr('useAnswers')
      };

      if (_isNumber(index)) {
        scope.varIndex = index;
      }

      return stache(templateSnippet)(scope);
    }
  }
});
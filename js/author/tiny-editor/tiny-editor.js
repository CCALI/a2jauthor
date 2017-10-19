import Map from 'can/map/';
import Component from 'can/component/';
import template from './tiny-editor.stache';

let formIdCounter = 0;
function getUniqueFormId () {
  formIdCounter += 1;
  return `tiny-editor-${formIdCounter}`;
}

function sanitizeHtml (html) {
  return window.form.htmlFix(html);
}

function insertToolbar (editor) {
  window.form.editorAdd(editor);
}

export const TinyEditorVm = Map.extend({
  init () {
    this.attr('formId', getUniqueFormId());
  },

  changeValue (value) {
    const handler = this.attr('onValue');
    if (handler) {
      handler(sanitizeHtml(value));
    }
  }
});

export default Component.extend({
  tag: 'tiny-editor',
  template,
  leakScope: false,
  viewModel: TinyEditorVm,
  events: {
    inserted () {
      const editor = this.element.find('.editable');
      this.viewModel.changeValue(editor.html());
    },

    removed () {
      const editor = this.element.find('.editable');
      this.viewModel.changeValue(editor.html());
    },

    '.editable focus'(target) {
      insertToolbar(target);
    },

    '.editable blur'(target) {
      this.viewModel.changeValue(target.html());
    },

    // Fixes IE11 contenteditable quirks
    '.editable DOMCharacterDataModified'(target) {
      this.viewModel.changeValue(target.html());
    },
  }
});

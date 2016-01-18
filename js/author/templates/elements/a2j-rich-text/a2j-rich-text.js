import Map from 'can/map/';
import loader from '@loader';
import stache from 'can/view/stache/';
import Component from 'can/component/';
import template from './a2j-rich-text.stache!';

import 'can/map/define/';

export let RichTextVM = Map.extend({
  define: {
    userContent: {
      value: ''
    },

    editEnabled: {
      value: false
    },

    editActive: {
      value: false
    },

    ckeditorInstance: {
      type: '*'
    },

    showOptionsPane: {
      value: true
    },

    wrapWithContainer: {
      value: true
    }
  },

  updateUserContent() {
    let instance = this.attr('ckeditorInstance');

    if (instance) {
      this.attr('userContent', instance.getData());
    }
  },

  destroyEditorInstance() {
    let instance = this.attr('ckeditorInstance');

    if (instance) {
      instance.destroy();
      this.attr('ckeditorInstance', null);
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-rich-text',

  viewModel(attrs) {
    return new RichTextVM(attrs.state);
  },

  helpers: {
    a2jParse(templateSnippet) {
      return stache(templateSnippet)({
        answers: this.attr('answers'),
        useAnswers: this.attr('useAnswers')
      });
    }
  },

  events: {
    inserted() {
      let vm = this.viewModel;
      let editActive = vm.attr('editActive');
      let editEnabled = vm.attr('editEnabled');

      if (editEnabled) {
        loader.import('caja/ckeditor/').then(() => {
          if (editActive) this.initCKEditor();
        });
      }
    },

    removed() {
      this.viewModel.destroyEditorInstance();
    },

    '{viewModel} editActive': function() {
      let vm = this.viewModel;
      let editActive = vm.attr('editActive');

      if (editActive) {
        this.initCKEditor();
      } else {
        vm.updateUserContent();
        vm.destroyEditorInstance();
      }
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
  }
});

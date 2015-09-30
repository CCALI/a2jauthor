import Map from 'can/map/';
import stache from 'can/view/stache/';
import Component from 'can/component/';
import template from './free-form.stache!';

import 'can/map/define/';
import './free-form.less!';
import '../element-container/';
import ckeditor from 'ckeditor/';

export let FreeFormVM = Map.extend({
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
  tag: 'free-form',

  viewModel: function(attrs) {
    return new FreeFormVM(attrs.state);
  },

  helpers: {
    a2jParse: function(templateSnippet) {
      templateSnippet = templateSnippet.isComputed ? templateSnippet() :
        templateSnippet;

      return stache(templateSnippet)();
    }
  },

  events: {
    removed() {
      this.viewModel.destroyEditorInstance();
    },

    '{viewModel} editActive': function() {
      let vm = this.viewModel;
      let editActive = vm.attr('editActive');

      if (editActive) {
        // wait for the template to be updated, otherwise the `textarea`
        // won't be in the DOM when `ckeditor.replace` is called.
        setTimeout(() => {
          let $textarea = this.element.find('textarea');

          let editor = ckeditor.replace($textarea.get(0), {
            extraPlugins: 'a2j-variable',
            extraAllowedContent: {
              'a2j-variable': {
                attributes: ['name']
              }
            }
          });

          vm.attr('ckeditorInstance', editor);
        });
      } else {
        vm.updateUserContent();
        vm.destroyEditorInstance();
      }
    }
  }
});

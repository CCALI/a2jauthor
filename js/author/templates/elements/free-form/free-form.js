import Map from 'can/map/';
import stache from 'can/view/stache/';
import Component from 'can/component/';
import template from './free-form.stache!';

import 'can/map/define/';
import './free-form.less!';
import '../element-container/';

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
  }
});

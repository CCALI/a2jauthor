import Map from 'can/map/';
import Component from 'can/component/';
import template from './free-form.stache!';
import stache from 'can/view/stache/';

import 'can/map/define/';

export let FreeFormVM = Map.extend({
  define: {
    userContent: {
      value: ''
    },
    enableEdit: {
      value: false
    }
  }
});

export default Component.extend({
  tag: 'free-form',
  template,
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

import Map from 'can/map/';
import Component from 'can/component/';
import template from './answer-loader.stache!';
import $ from 'jquery';

import 'can/map/define/';

export let AnswerLoaderVM = Map.extend({
  define: {
    isEnabled: {
      get() {
        let gGuide = window.gGuide || {};

        return !!gGuide.HotDocsAnswerSetFromXML
      }
    }
  }
});

export default Component.extend({
  tag: 'answer-loader',
  viewModel: AnswerLoaderVM,
  template,
  events: {
    '.load-answers click': function($el) {
      $el.find('+ input').click();
    },
    'input change': function($el) {
      let file = $el[0].files[0];
      let reader = new FileReader();

      reader.onload = function() {
        window.gGuide.HotDocsAnswerSetFromXML($.parseXML(reader.result));
      };

      reader.readAsText(file);
    }
  }
});

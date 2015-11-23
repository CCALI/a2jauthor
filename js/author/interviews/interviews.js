import Map from 'can/map/';
import Component from 'can/component/';
import Guide from 'author/models/guide';
import template from './interviews.stache!';

import 'can/map/define/';

let InterviewsVM = Map.extend({
  define: {
    blankInterview: {
      get() {
        return {
          id: 'a2j',
          title: 'Blank Interview'
        };
      }
    }
  }
});

/**
 * @module {function} components/interviews/ <interviews-page>
 * @parent api-components
 * @signature `<interviews-page>`
 *
 * Displays a list of existing interviews.
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'interviews-page',
  viewModel: InterviewsVM,

  events: {
    inserted: function() {
      let vm = this.viewModel;
      let updateGuidePromise = can.Deferred().resolve();

      // if there is a loaded guide when this component is inserted,
      // save the guide first and then fetch the guides.
      // https://github.com/CCALI/CAJA/issues/527
      if (window.gGuide) {
        updateGuidePromise = can.Deferred();

        window.guideSave(function() {
          updateGuidePromise.resolve();
        });
      }

      let interviews = updateGuidePromise.then(function() {
        return Guide.findAll();
      });

      vm.attr('interviews', interviews);
    },

    '.guide click': function(target) {
      this.element.find('.guide').removeClass('active');
      target.addClass('active');
    },

    '.guide dblclick': function() {
      window.openSelectedGuide();
    }
  },

  helpers: {
    formatFileSize: function(sizeInBytes) {
      sizeInBytes = sizeInBytes();
      let sizeInKB = Math.ceil(sizeInBytes / 1024);
      return sizeInKB ? `${sizeInKB}K` : '';
    }
  }
});

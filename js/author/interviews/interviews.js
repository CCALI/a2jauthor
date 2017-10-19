import Map from 'can/map/';
import Component from 'can/component/';
import List from 'can/list/';
import Guide from 'author/models/guide';
import template from './interviews.stache!';

import 'can/map/define/';

export const InterviewsVM = Map.extend({
  define: {
    blankInterview: {
      get() {
        return {
          id: 'a2j',
          title: 'Blank Interview'
        };
      }
    },
    traceLogicList: {
      serialize: false
    },
    currentGuideId: {
      type: 'string',
      get(lastSet) {
        return lastSet || window.gGuideID;
      },
      set(val) {
        return val;
      }
    }
  },

  clearPreviewState() {
      // fired on inserted event to clear any Author preview answer/tracelogic
      if (this.attr('traceLogicList') && this.attr('traceLogicList').length > 0) {
        this.attr('traceLogicList', new List());
      }

      if (this.attr('%root.viewerInterview')) {
        this.attr('%root.viewerInterview').clearAnswers();
      }
  },

  deleteInterview(id) {
    const interviews = this.attr('interviews');

    if (interviews) {
      let index = -1;

      interviews.each(function(interview, i) {
        if (interview.attr('id') === id) {
          index = i;
          return false;
        }
      });

      if (index !== -1) interviews.splice(index, 1);
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

  helpers: {
    formatFileSize: function(sizeInBytes) {
      sizeInBytes = sizeInBytes();
      let sizeInKB = Math.ceil(sizeInBytes / 1024);
      return sizeInKB ? `${sizeInKB}K` : '';
    }
  },

  events: {
    inserted: function() {
      const vm = this.viewModel;

      // clear debug-panel traceLogicList and preview answers
      // even if we don't change interviews
      vm.clearPreviewState();


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

      const interviewsPromise = updateGuidePromise
        .then(function() {
          return Guide.findAll();
        })
        .then(function(interviews) {
          vm.attr('interviews', interviews);
        });

      vm.attr('interviewsPromise', interviewsPromise);
    },

    '.guide click': function(target) {
      this.element.find('.guide').removeClass('item-selected');
      target.addClass('item-selected');
    },

    '.guide dblclick': function(target) {
      const gid = target.attr('gid');
      window.openSelectedGuide(gid);
    },

    '{window} author:guide-deleted': function(window, evt, guideId) {
      this.viewModel.deleteInterview(guideId);
    }
  }
});

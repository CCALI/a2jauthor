import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './steps.stache!';
import _isNaN from 'lodash/lang/isNaN';
import _startsWith from 'lodash/string/startsWith';
import {resizeBubbles, resizeSteps} from 'viewer/resize-bubbles';

import 'can/map/define/';

let ViewerStepsVM = Map.extend({
  define: {
    steps: {
      get() {
        return this.attr('interview.steps');
      }
    },

    currentPage: {
      get() {
        let interview = this.attr('interview');
        let pageName = this.attr('rState.page');
        return interview.getPageByName(pageName);
      }
    },

    currentStep: {
      get() {
        return this.attr('currentPage.step');
      }
    },

    nextSteps: {
      get() {
        let currentStep = this.attr('currentStep');

        if (currentStep) {
          let stepNumber = parseInt(currentStep.attr('number'), 10);
          return this.attr('steps').slice(stepNumber + 1);
        }
      }
    },

    avatarSkinTone: {
      get() {
        let mState = this.attr('mState');
        let interview = this.attr('interview');
        let globalSkinTone = mState.attr('avatarSkinTone');
        let interviewSkinTone = interview.attr('avatarSkinTone');

        return globalSkinTone || interviewSkinTone;
      }
    },

    // we should not show the client avatar if the current page has the user
    // gender field, this prevents the avatar to be rendered right when user
    // selects their gender, which causes a weird jump of the avatar bubble.
    showClientAvatar: {
      get() {
        let interview = this.attr('interview');
        let currentPage = this.attr('currentPage');
        let hasUserGenderField = currentPage.attr('hasUserGenderField');

        return interview.attr('userGender') && !hasUserGenderField;
      }
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-viewer-steps',
  viewModel: ViewerStepsVM,

  events: {
    inserted() {
      let interview = this.viewModel.attr('interview');

      let resizeStepsAndBubbles = function() {
        resizeBubbles();
        resizeSteps(interview.attr('steps.length'));
      };

      $(window).on('resize', resizeStepsAndBubbles);

      resizeStepsAndBubbles();
      this.setStepsLeftClass();
      this.element.find('object').on('load', resizeStepsAndBubbles);
    },

    '{viewModel} nextSteps': function() {
      this.setStepsLeftClass();
    },

    setStepsLeftClass() {
      let $body = $('body');
      let nextSteps = this.viewModel.attr('nextSteps');
      let stepsLeft = nextSteps.attr('length');

      $body.removeClass(function(i, classes) {
        let matches = c => _startsWith(c, 'steps-left-');
        return classes.split(' ').filter(matches).join(' ').trim();
      });

      $body.addClass(`steps-left-${stepsLeft}`);
    }
  },

  helpers: {
    zeroOrUndefined(number, options) {
      number = number.isComputed ? number() : number;
      number = parseInt(number, 10);

      return (number === 0 || _isNaN(number))
        ? options.fn()
        : options.inverse();
    },

    formatStepNumber(number) {
      number = number.isComputed ? number() : number;
      return parseInt(number, 10) + 1;
    }
  }
});

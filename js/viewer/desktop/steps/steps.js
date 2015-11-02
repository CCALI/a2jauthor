import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './steps.stache!';
import _isNaN from 'lodash/lang/isNaN';
import _flow from 'lodash/function/flow';
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
      let resizeStepsAndBubbles = _flow(resizeBubbles, resizeSteps);

      resizeStepsAndBubbles();

      $(window).on('resize', resizeStepsAndBubbles);
      this.element.find('object').on('load', resizeBubbles);
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

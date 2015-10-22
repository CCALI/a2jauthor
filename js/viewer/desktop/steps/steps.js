import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './steps.stache!';
import resizeBubbles from 'viewer/resize-bubbles';

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
      resizeBubbles();
      $(window).on('resize', resizeBubbles);
    },

    removed() {
      $(window).off('resize', resizeBubbles);
    }
  },

  helpers: {
    formatStepNumber(number) {
      number = number.isComputed ? number() : number;
      return Number(number) + 1;
    }
  }
});

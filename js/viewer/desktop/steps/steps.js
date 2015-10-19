import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './steps.stache!';
import _inRange from 'lodash/number/inRange';
import resizeBubbles from 'viewer/resize-bubbles';

import 'can/map/define/';

let ViewerStepsVM = Map.extend({
  define: {
    maxSteps: {
      value: 3
    },

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

    displaySteps: {
      get() {
        let maxSteps = this.attr('maxSteps');
        let currentStep = this.attr('currentStep');
        let stepNumber = parseInt(currentStep.attr('number'), 10);
        let maxStepNumber = stepNumber + maxSteps;

        return this.attr('steps').filter(function(step) {
          let number = parseInt(step.attr('number'), 10);
          return _inRange(number, stepNumber, maxStepNumber);
        });
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

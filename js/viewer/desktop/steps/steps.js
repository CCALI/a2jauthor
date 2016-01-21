import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import _isNaN from 'lodash/isNaN';
import _inRange from 'lodash/inRange';
import Component from 'can/component/';
import template from './steps.stache!';

import 'can/map/define/';

/**
 * @property {can.Map} steps.ViewModel
 * @parent <a2j-viewer-steps>
 *
 * `<a2j-viewer-steps>`'s viewModel.
 */
export let ViewerStepsVM = Map.extend({
  define: {
    /**
     * @property {String} steps.ViewModel.prototype.steps steps
     * @parent steps.ViewModel
     *
     * list of steps in the interview
     */
    steps: {
      get() {
        return this.attr('interview.steps');
      }
    },

    /**
     * @property {String} steps.ViewModel.prototype.currentPage currentPage
     * @parent steps.ViewModel
     *
     * current page in interview
     */
    currentPage: {
      get() {
        let interview = this.attr('interview');
        let pageName = this.attr('rState.page');
        return interview.getPageByName(pageName);
      }
    },

    /**
     * @property {String} steps.ViewModel.prototype.currentStep currentStep
     * @parent steps.ViewModel
     *
     * current step in interview
     */
    currentStep: {
      get() {
        return this.attr('currentPage.step');
      }
    },

    /**
     * @property {String} steps.ViewModel.prototype.nextSteps nextSteps
     * @parent steps.ViewModel
     *
     * steps after current step in interview
     */
    nextSteps: {
      get() {
        let currentStep = this.attr('currentStep');

        if (currentStep) {
          let stepNumber = parseInt(currentStep.attr('number'), 10);
          return this.attr('steps').slice(stepNumber + 1);
        }
      }
    },

    /**
     * @property {String} steps.ViewModel.prototype.remainingSteps remainingSteps
     * @parent steps.ViewModel
     *
     * number of steps after current step in interview
     */
    remainingSteps: {
      get() {
        return this.attr('nextSteps.length');
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.maxDisplayedSteps maxDisplayedSteps
     * @parent steps.ViewModel
     *
     * maximum number of steps to display on screen
     *
     * based on the height of the sidewalk and number of steps in the interview
     *
     */
    maxDisplayedSteps: {
      get() {
        let sidewalkHeight = this.attr('sidewalkHeight');
        let interviewSteps = this.attr('steps.length');
        let maxSteps;

        if (sidewalkHeight < 100) {
          maxSteps = 1;
        } else if (_inRange(sidewalkHeight, 100, 450)) {
          maxSteps = 2;
        } else if (_inRange(sidewalkHeight, 450, 550)) {
          maxSteps = 3;
        } else if (_inRange(sidewalkHeight, 550, 750)) {
          maxSteps = 4;
        } else {
          maxSteps = 5;
        }

        return interviewSteps < maxSteps ? interviewSteps : maxSteps;
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.avatarSkinTone avatarSkinTone
     * @parent steps.ViewModel
     *
     * skin tone of avatar to be displayed in steps
     *
     */
    avatarSkinTone: {
      get() {
        let globalSkinTone = this.attr('mState.avatarSkinTone');
        let interviewSkinTone = this.attr('interview.avatarSkinTone');

        return globalSkinTone || interviewSkinTone;
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.showClientAvatar showClientAvatar
     * @parent steps.ViewModel
     *
     * whether the client avatar should be shown
     *
     * we should not show the client avatar if the current page has the user
     * gender field, this prevents the avatar to be rendered right when user
     * selects their gender, which causes a weird jump of the avatar bubble.
     *
     */
    showClientAvatar: {
      get() {
        return this.attr('interview.userGender') && !this.attr('currentPage.hasUserGenderField');
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.guideAvatarFacingDirection guideAvatarFacingDirection
     * @parent steps.ViewModel
     *
     * direction the guide avatar should face
     *
     * face right when client avatar is displayed; otherwise, face front
     *
     */
    guideAvatarFacingDirection: {
      get() {
        return this.attr('showClientAvatar') ? 'right' : 'front';
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.sidewalkLength sidewalkLength
     * @parent steps.ViewModel
     *
     * length of the angled side of the sidewalk
     *
     * this is the hypoteneuse of the right-triangle used for drawing the sidewalk
     * where the other sides of the triangle are the height and width of the `<div id="sidewalk"></div>`
     *
     */
    sidewalkLength: {
      type: 'number',
      get() {
        let sidewalkHeight = this.attr('sidewalkHeight');
        let sidewalkWidth = this.attr('sidewalkWidth');
        return Math.sqrt(Math.pow(sidewalkHeight, 2) + Math.pow(sidewalkWidth, 2));
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.sidewalkAngleA sidewalkAngleA
     * @parent steps.ViewModel
     *
     * Angle of bottom left corner of the right-triangle used for drawing the sidewalk
     * used for approximating the width of each step
     *
     * calculated by solving the equation `sin(A) = h1 / w1`
     *
     * @codestart
     *               /|  ______
     *              / |       |
     *             /  |       |
     *            /   |       |
     *           /    |      h1
     *          /     |       |
     *         /      |       |
     *        /_______|  _____|
     *       A    w1
     * @codeend
     */
    sidewalkAngleA: {
      type: 'number',
      get() {
        return Math.asin( this.attr('sidewalkHeight') / this.attr('sidewalkLength') );
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.guideBubbleTallerThanAvatar guideBubbleTallerThanAvatar
     * @parent steps.ViewModel
     *
     * whether the guide bubble is taller than the avatar
     *
     */
    guideBubbleTallerThanAvatar: {
      get() {
        return this.attr('guideBubbleHeight') > this.attr('avatarHeight');
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.clientBubbleTallerThanAvatar clientBubbleTallerThanAvatar
     * @parent steps.ViewModel
     *
     * whether the client bubble is taller than the avatar
     *
     */
    clientBubbleTallerThanAvatar: {
      get() {
        return this.attr('clientBubbleHeight') > this.attr('avatarHeight');
      }
    },

    /**
     * @property {Number} steps.ViewModel.prototype.minusHeader minusHeader
     * @parent steps.ViewModel
     *
     * @minusHeader less variable reverse engineered
     *
     */
    minusHeader: {
      type: 'number',
      get() {
        let headerHeight = this.attr('bodyHeight') - this.attr('sidewalkHeight');
        return Math.ceil(headerHeight / 2);
      }
    },

    /**
     * DOM values
     */
    bodyHeight: {
      type: 'number'
    },

    sidewalkHeight: {
      type: 'number'
    },

    sidewalkWidth: {
      type: 'number'
    },

    guideBubbleHeight: {
      type: 'number'
    },

    avatarHeight: {
      type: 'number'
    },

    avatarOffsetTop: {
      type: 'number'
    },

    stepNextCssBottom: {
      Type: List,
      Value: List
    }
  },

  /**
   * @property {Number} steps.ViewModel.prototype.getStepWidth getStepWidth
   * @parent steps.ViewModel
   *
   * get the width of a step based on its index
   *
   * this is done by solving for w2 in the equation `tan(A) = h2 / w2`
   *
   * @codestart
   *               /|  ______
   *              / |  |    |
   *             /  |  h2   |
   *            /   |  |    |
   *           /____|  _   h1
   *          / w2  |       |
   *         /      |       |
   *        /_______|  _____|
   *       A    w1
   * @codeend
   */
  getStepWidth(isCurrentStep, index) {
    // for current step, align the bottom of the step with the bottom of the avatar
    // for next steps, align the bottom of the step with the bottom of its parent (set by css)
    let bottom = isCurrentStep ?
                  this.attr('avatarOffsetTop') :
                  this.attr('stepNextCssBottom').attr(index);

    // reverse engineer less equation `calc(~"x% - " minusHeader) = bodyHeight`
    // solve above equation for x, which will be percentBelow
    let percentBelow = Math.ceil(((bottom + this.attr('minusHeader')) / this.attr('bodyHeight')) * 100);
    let percentAbove = (100 - percentBelow) / 100;

    return (this.attr('sidewalkHeight') * percentAbove) / Math.tan(this.attr('sidewalkAngleA'));
  },

  /**
   * @property {Number} steps.ViewModel.prototype.formatStepStyles formatStepStyles
   * @parent steps.ViewModel
   *
   * the style attribute value needed for styling a step based on its width
   */
  formatStepStyles(width) {
    return 'margin-right: ' + `-${Math.ceil(width * .1)}px;` +
           'width: ' +`calc(0% + ${Math.ceil(width + (width * .3))}px);`
  },

  avatarLoaded() {
    this.updateDomProperties();
  },

  updateDomProperties() {
    let vm = this;

    vm.attr('bodyHeight', $('body').height());

    let $sidewalk = $('#sidewalk');
    vm.attr('sidewalkWidth', $sidewalk.width());
    vm.attr('sidewalkHeight', $sidewalk.height());

    let $guideBubble = $('#guideBubble');
    vm.attr('guideBubbleHeight', $guideBubble.height());

    let $clientBubble = $('#clientBubble');
    vm.attr('clientBubbleHeight', $clientBubble.height());

    let $avatar = $guideBubble.parent();
    vm.attr('avatarHeight', $avatar.height());
    vm.attr('avatarOffsetTop', $avatar.offset() && $avatar.offset().top);

    $('.step-next').each((i, el) => {
      let $el = $(el);
      let cssBottom = $el.css('bottom');
      cssBottom = +cssBottom.slice(0, cssBottom.indexOf('px'));
      vm.attr('stepNextCssBottom').attr(i, cssBottom);
    });
  }
});

/**
 * @module {Module} viewer/desktop/steps/ <a2j-viewer-steps>
 * @parent api-components
 *
 * this component displays an interviews steps
 *
 * ## Use
 *
 * @codestart
 *   <a2j-viewer-steps
 *    {(interview)}="interview" />
 * @codeend
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-viewer-steps',
  viewModel: ViewerStepsVM,

  events: {
    inserted() {
      this.viewModel.updateDomProperties();
    },

    '{window} resize': function() {
      this.viewModel.updateDomProperties();
    },

    '{viewModel} showDebugPanel': function(vm) {
      setTimeout(vm.updateDomProperties.bind(vm));
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

    add(a, b) {
      a = a.isComputed ? +a() : +a;
      b = b.isComputed ? +b() : +b;
      return a + b;
    }
  }
});

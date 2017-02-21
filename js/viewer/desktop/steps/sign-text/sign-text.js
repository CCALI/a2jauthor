import Map from 'can/map/';
import Component from 'can/component/';
import _truncate from 'lodash/truncate';
import template from './sign-text.stache!';

import 'caja/viewer/util/jquery-textfill';

/**
 * @property {can.Map} signText.ViewModel
 * @parent <a2j-viewer-sign-text>
 *
 * `<a2j-viewer-sign-text>`'s viewModel.
 */
export let SignTextVM = Map.extend({
  define: {
    /**
     * @property {String} signText.ViewModel.prototype.displayText displayText
     * @parent signText.ViewModel
     *
     * text truncated to viewModel.maxChars and appended with viewModel.overflowText
     */
    displayText: {
      get() {
        return _truncate(this.attr('text'), {
          length: this.attr('maxChars') + this.attr('overflowText').length,
          separator: ' ',
          omission: this.attr('overflowText')
        });
      }
    },

    /**
     * @property {String} signText.ViewModel.prototype.maxChars maxChars
     * @parent signText.ViewModel
     *
     * maximum number of characters to display in displayText
     */
    maxChars: {
      type: 'number',
      value: 50
    },

    /**
     * @property {String} signText.ViewModel.prototype.overflowText overflowText
     * @parent signText.ViewModel
     *
     * string to display at end of displayText if it is truncated
     */
    overflowText: {
      type: 'string',
      value: '...'
    },

    /**
     * @property {Number} signText.ViewModel.prototype.currentStepNumber currentStepNumber
     * @parent signText.ViewModel
     *
     * index of current step number in <a2j-viewer-steps>
     *
     * used for triggering resize of text when user navigates to next step
     */
    currentStepNumber: {
      type: 'number'
    },

    /**
     * @property {Boolean} signText.ViewModel.prototype.isCurrentStep isCurrentStep
     * @parent signText.ViewModel
     *
     * whether this is the current step
     *
     */
    isCurrentStep: {
      type: 'boolean'
    },

    /**
     * @property {Element} signText.ViewModel.prototype.paragraph paragraph
     * @parent signText.ViewModel
     *
     * the jQuery-wrapped DOM element of the <p> in the <a2j-viewer-sign-text> template
     *
     */
    paragraph: {
      value: null
    },

    /**
     * @property {Element} signText.ViewModel.prototype.paragraphContainer paragraphContainer
     * @parent signText.ViewModel
     *
     * the jQuery-wrapped DOM element of the <p>'s parent in the <a2j-viewer-sign-text> template
     *
     */
    paragraphContainer: {
      value: null
    }
  },

  /**
   * @property {Element} signText.ViewModel.prototype.resizeText resizeText
   * @parent signText.ViewModel
   *
   * resize the text of the <p>
   *
   * uses jQuery.textfill to set the font-size so that it will be as large as
   * possible within its container while always leaving space for two lines of text
   *
   */
  resizeText() {
    let vm = this;
    let doResize = function() {
      let paragraph = vm.attr('paragraph');

      if (paragraph) {
        // remove inline line-height set by updateLineHeight function
        // otherwise the sizing calculation will not work correctly
        paragraph.css('line-height', '');

        let innerText = paragraph[0].innerHTML;
        let words = innerText.split(" ");
        if(words.length === 1) {
          //we only have one word here so we need to apply some css tricks
          paragraph.css({
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'overflow': 'hidden'
          });
        } else {
          //let's remove this temp styles
          paragraph.css({
            'text-overflow': '',
            'white-space': '',
            'overflow': ''
          });
        }

        let maxFontPixels = Math.floor(vm.attr('paragraphContainer').height() / 2);

        vm.attr('paragraphContainer').textfill({
          innerTag: 'div',
          // once the text size has been set, update the line height
          success: vm.updateLineHeight.bind(vm),
          maxFontPixels: maxFontPixels
        });
      }
    };

    // a timeout is needed when resizing the currentStep to ensure
    // that the text is updated before being resized
    if (this.attr('isCurrentStep')) {
      setTimeout(doResize);
    } else {
      doResize();
    }
  },

  /**
   * @property {Element} signText.ViewModel.prototype.updateLineHeight updateLineHeight
   * @parent signText.ViewModel
   *
   * update the line-height of the <p>
   *
   * set the line-height so that
   * if this is one line of text, it will be centered
   * if there are two lines of text, they will be evenly spaced
   *
   */
  updateLineHeight() {
    // calculate how many lines of text there are
    let height = this.attr('paragraph').height();
    let lineHeight = this.attr('paragraph').css('line-height');
    lineHeight = Math.ceil(lineHeight.substr(0, lineHeight.indexOf('px')));
    let numLines = Math.ceil(height / lineHeight);

    // set line-height to evenly space lines
    let paragraphContainerHeight = this.attr('paragraphContainer').height();
    let newLineHight = Math.floor(paragraphContainerHeight / numLines);
    this.attr('paragraph').css('line-height', newLineHight + 'px');
  }
});

/**
 * @module {Module} viewer/desktop/steps/sign-text/ <a2j-viewer-sign-text>
 * @parent viewer/desktop/steps/
 *
 * this component displays text and sets its size and line-height to
 * fill its parent's height and width while always allowing space for
 * at least two lines of text
 *
 * ## Use
 *
 * @codestart
 *   <a2j-viewer-sign-text
 *    {current-step-number}="currentStep.number"
 *    {is-current-step}="false"
 *    {text}="text" />
 * @codeend
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-viewer-sign-text',
  viewModel: SignTextVM,

  events: {
    inserted() {
      let $p = this.element.find('div div');
      this.viewModel.attr('paragraph', $p);
      this.viewModel.attr('paragraphContainer', $p.parent());
      this.viewModel.resizeText();
    },

    // resize when user navigates to next step
    '{viewModel} currentStepNumber': function(vm) {
      setTimeout(vm.resizeText.bind(vm));
    },

    // resize when debug-panel opens
    '{viewModel} showDebugPanel': function(vm) {
      setTimeout(vm.resizeText.bind(vm));
    }
  }
});

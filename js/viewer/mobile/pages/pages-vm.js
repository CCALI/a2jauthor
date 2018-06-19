import Map from 'can/map/';
import _some from 'lodash/some';
import _isString from 'lodash/isString';
import AnswerVM from 'caja/viewer/models/answervm';
import Parser from 'caja/viewer/mobile/util/parser';
import {ViewerNavigationVM} from 'caja/viewer/desktop/navigation/navigation';
import constants from 'caja/viewer/models/constants';
import {Analytics} from 'caja/viewer/util/analytics';

import 'can/util/batch/';
import 'can/map/define/';
import 'can/util/jquery/';
import 'bootstrap/js/modal';
import { FieldVM } from './fields/field/field';

/**
 * @property {can.Map} pages.ViewModel
 * @parent viewer/mobile/pages/
 *
 * `<a2j-pages>` viewModel.
 */
export default Map.extend('PagesVM', {
  define: {
    /**
     * @property {String} pages.ViewModel.prototype.currentPage currentPage
     * @parent pages.ViewModel
     *
     * String used to represent the current active page
     */
    currentPage: {
      value: null
    },

    /**
     * @property {Object} pages.ViewModel.prototype.modalContent modalContent
     * @parent pages.ViewModel
     *
     * Object that defines properties and values for popup and learn more modals
     */
    modalContent: {
      value: null
    },

    /**
     * @property {String} pages.ViewModel.prototype.backButton backButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that sends the user back to the most
     * recently visited page.
     */
    backButton: {
      value: constants.qIDBACK
    },

    /**
     * @property {String} pages.ViewModel.prototype.saveAnswersButton saveAnswersButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that saves the answers to the server
     * and replaces the viewer with the server's response.
     */
    saveAnswersButton: {
      value: constants.qIDSUCCESS
    },

    /**
     * @property {String} pages.ViewModel.prototype.exitButton exitButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that saves the answers to the server
     * when the interview is only partially complete.
     */
    exitButton: {
      value: constants.qIDEXIT
    },

     /**
     * @property {String} pages.ViewModel.prototype.resumeButton resumeButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that resumes the interview rather than Exit.
     */
    resumeButton: {
      value: constants.qIDRESUME
    },

    /**
     * @property {String} pages.ViewModel.prototype.assembleButton assembleButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that generates a PDF document.
     */
    assembleButton: {
      value: constants.qIDASSEMBLE
    },

    /**
     * @property {String} pages.ViewModel.prototype.assembleAndSaveButton assembleAndSaveButton
     * @parent pages.ViewModel
     *
     * String used to represent the button that generates a PDF document and also
     * saves the answers to the server.
     */
    assembleAndSaveButton: {
      value: constants.qIDASSEMBLESUCCESS
    },

    /**
     * @property {String} pages.ViewModel.prototype.guideId guideId
     * @parent pages.ViewModel
     *
     * Id of the guided interview being "previewed" by the author.
     *
     * This property is not available (it's undefined) when the viewer runs
     * in standalone mode. It's used during document assembly to filter the
     * templates used to generate the final document.
     */
    guideId: {
      get() {
        return window.gGuideID;
      }
    },

    /**
     * @property {String} pages.ViewModel.prototype.answersString answersString
     * @parent pages.ViewModel
     *
     * JSON representation of the `answers` entered by the user.
     *
     * This is used during document assembly to fill in the variables added by
     * the author to any of the templates.
     */
    answersString: {
      get() {
        const answers = this.attr('pState.answers');
        return JSON.stringify(answers.serialize());
      }
    },

    /**
     * @property {String} pages.ViewModel.prototype.answersString answersString
     * @parent pages.ViewModel
     *
     * XML version of the `answers` entered by the user.
     *
     * This is POSTed to `setDataURL` when user finishes the interview,
     * and populated when a user loads saved answers.
     */
    answersANX: {
      get() {
        const answers = this.attr('interview.answers');
        const parsed = Parser.parseANX(answers.serialize());
        return parsed;
      }
    },

    traceLogic: {
      value: []
    }

  },


  init() {
    this.setCurrentPage();
  },

  returnHome() {
    this.attr('rState').attr({}, true);
  },

  validateAllFields() {
    const fields = this.attr('currentPage.fields');

    can.each(fields, function(field) {
      const hasError = !!field.attr('_answer').errors();
      field.attr('hasError', hasError);
    });
  },

  traceButtonClicked(buttonLabel) {
    this.attr('traceLogic').push({
      button: [
        { msg: 'You pressed' },
        { format: 'ui', msg: buttonLabel }
      ]
    });
  },

  traceLogicAfterQuestion() {
    this.attr('traceLogic').push({
      codeAfter: { format: 'info', msg: 'Logic After Question' }
    });
  },

  handleIE11 (fields, logic, traceLogic) {
    // this is to handle the mis-firing of `change` event
    // in IE11 when "tabbing" through the fields as per this bug
    if (logic && fields && fields.length > 0) {
      const answers = logic.attr("interview.answers");
      if (answers) {
        let vm = new FieldVM();
        fields.each(function (field) {
          const type = field.attr('type');
          // These types work with native code because you have to click to select
          // which fires the blue/change event to validate the answer
          if (type !== 'gender' &&
              type !== 'checkbox' &&
              type !== 'checboxNOTA' &&
              type !== 'radio' &&
              type !== 'textpick' &&
              type !== 'numberpick') {
            // Handle each field as if the blur/focus event had fired correctly with validateField
            const fieldName = field.attr('name');
            const escapedFieldName = fieldName.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\$&");
            const preSelector = field.type !== 'textlong' ? 'input' : 'textarea';
            const $fieldEl = $(preSelector + "[name='" + escapedFieldName + "']");

            // validateField expects `this` to have field and traceLogic
            vm.attr({field, traceLogic});

            // fire same answer pre-validation as jquery datepicker
            if (type === 'datemdy') {
              vm.validateDatepicker($fieldEl);
            } else {
              vm.validateField(vm, $fieldEl);
            }
          }
        });
        // Cleanup temp FieldVM instance
        vm = null;
      }
    }
  },

  navigate (button) {
    const page = this.attr('currentPage');
    const fields = page.attr('fields');
    const logic = this.attr('logic');
    const traceLogic = this.attr('traceLogic');

    // IE11 fails to fire all validateField events, handle that here
    if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      this.handleIE11(fields, logic, traceLogic);
    }
    // Author Preview Mode changes handling of special buttons, and does not post answers
    const previewActive = this.attr('rState').attr('previewActive');
    //

    if (previewActive &&
      (button.next === constants.qIDFAIL ||
      button.next === constants.qIDEXIT ||
      button.next === constants.qIDSUCCESS ||
      button.next === constants.qIDASSEMBLESUCCESS ||
      button.next === constants.qIDASSEMBLE)
      ) {
      this.previewActiveResponses(button);
      // need `false` to stop default submit actions in preview
      return false;
    }

    // special destination dIDRESUME button skips rest of navigate
    if (button.next === constants.qIDRESUME) {
      let interview = this.attr('interview');
      let appState = this.attr('rState');
      // Handle the same as Desktop Navigation Resume
      let vm = new ViewerNavigationVM({appState, interview});
      vm.resumeInterview();
      return;
    }

    // special destination qIDFAIL button skips rest of navigate
    // Author can provide an external URL to explain why user did not qualify
    if (button.next === constants.qIDFAIL) {
      let failURL = button.url.toLowerCase();
      let hasProtocol = failURL.indexOf('http') === 0;
      failURL = hasProtocol ? failURL : 'http://' + failURL;
        if(failURL === "http://") {
          // If Empty, standard message
          this.attr('modalContent', {
            title: "You did not Qualify",
            text: "Unfortunately, you did not qualify to use this A2J Guided Interview. Please close your browser window or tab to exit the interview.",
          });
        } else {
          // track the external link
          if (window._paq) {
            Analytics.trackExitLink(failURL, 'link');
          }
          window.open(failURL, '_blank');
        }
      return;
    }


    this.traceButtonClicked(button.attr('label'));

    // Set answers for buttons with values
    if (button.name) {
      const logic = this.attr('logic');
      const buttonAnswer = this.__ensureFieldAnswer(button);
      let buttonAnswerIndex = 1;

      if (page.attr('repeatVar')) {
        const repeatVar = page.attr('repeatVar');
        const repeatVarCount = logic.varGet(repeatVar);

        buttonAnswerIndex = (repeatVarCount != null) ? repeatVarCount : buttonAnswerIndex;
      }

      let buttonValue = button.value;

      if (buttonAnswer.type === 'TF') {
        buttonValue = buttonValue.toLowerCase() === "true" ? true : false;
      } else if (buttonAnswer.type === "Number") {
        buttonValue = parseInt(buttonValue);
      }

      buttonAnswer.attr('values.' + buttonAnswerIndex, buttonValue);
    }

    this.validateAllFields();

    const anyFieldWithError = _some(fields, f => f.attr('hasError'));

    if (!anyFieldWithError) {
      const logic = this.attr('logic');
      const codeAfter = page.attr('codeAfter');
      const repeatVar = button.attr('repeatVar');
      const repeatVarSet = button.attr('repeatVarSet');

      // default next page is derived from the button pressed.
      // might be overridden by the After logic or special
      // back to prior question button.
      logic.attr('gotoPage', button.next);

      // execute After logic only if not going to a prior question
      if (codeAfter && button.next !== constants.qIDBACK) {
        this.traceLogicAfterQuestion();
        logic.exec(codeAfter);
      }

      // repeatVar holds the name of the variable that acts as the total count
      // of a repeating variable; and repeatVarSet indicates whether that
      // variable should be set to `1` or increased, `setRepeatVariable` takes
      // care of setting `repeatVar` properly.
      if (repeatVar && repeatVarSet) {
        this.setRepeatVariable(repeatVar, repeatVarSet);
      }

      // Don't post to the server in Author Preview aka previewActive
      if (!previewActive && (button.next === constants.qIDASSEMBLESUCCESS || button.next === constants.qIDSUCCESS || button.next === constants.qIDEXIT)) {
        // This disable is for LHI/HotDocs issue taking too long to process
        // prompting users to repeatedly press submit, crashing HotDocs
        // Matches A2J4 functionality, but should really be handled better on LHI's server
        this.attr('modalContent', {
          title: "Answers Submitted :",
          text: 'Page will redirect shortly',
        });
        can.trigger(this, 'post-answers-to-server');

        // disable the previously clicked button
        setTimeout(() => {
          $('button:contains(' + button.label + ')').prop('disabled', true);
        });
      }

      // user has selected to navigate to a prior question
      if (button.next === constants.qIDBACK) {
        const visitedPages = this.rState.attr('visitedPages');
        // last visited page always at index 1
        // TODO: GOTO logic could break the above assumption
        // might need a better way to track the last page
        const priorQuestion = (visitedPages[1].attr('name'));
        // override with new gotoPage
        logic.attr('gotoPage', priorQuestion);
        button.attr('next', priorQuestion);
      }

      const gotoPage = logic.attr('gotoPage');
      const logicPageisNotEmpty = _isString(gotoPage) && gotoPage.length;

      // this means the logic After has overriden the destination page, we
      // should navigate to this page instead of the page set by `button.next`.
      if (logicPageisNotEmpty && gotoPage !== button.next) {
        logic.attr('gotoPage', null);
        this._setPage(page, gotoPage);

      // only navigate to the `button.next` page if the button clicked is not
      // any of the buttons with "special" behavior.
      } else if (button.next !== constants.qIDEXIT &&
        button.next !== constants.qIDSUCCESS &&
        button.next !== constants.qIDASSEMBLE &&
        button.next !== constants.qIDASSEMBLESUCCESS &&
        button.next !== constants.qIDFAIL) {

        this._setPage(page, button.next);

      }

      // if these special buttons are used, the interview is complete (incomplete is false)
      if (button.next === constants.qIDFAIL ||
        button.next === constants.qIDSUCCESS ||
        button.next === constants.qIDASSEMBLE ||
        button.next === constants.qIDASSEMBLESUCCESS) {
        const answers = this.attr('interview.answers');
        answers.attr(`${constants.vnInterviewIncompleteTF.toLowerCase()}.values`, [null, false]);
      }
      // Make sure pages looping on themselves update
      if (page.name === gotoPage) {
        let rState = this.attr('rState');
        let interview = this.attr('interview');
        rState.attr('singlePageLoop', true);

        rState.setVisitedPages(gotoPage, interview);
        can.trigger(rState, 'page',[gotoPage]);

        rState.attr('singlePageLoop', false);
      }

      return;
    }

    // do nothing if there are field(s) with error(s)
    return false;
  },

  previewActiveResponses (button) {
    switch(button.next) {
      case constants.qIDFAIL:
        this.attr('modalContent', {
          title: "Author note:",
          text: 'User would be redirected to \n(' + button.url +')'
        });
        break;

      case constants.qIDEXIT:
        this.attr('modalContent', {
          title: "Author note:",
          text: "User's INCOMPLETE data would upload to the server."
        });
        break;

      case constants.qIDASSEMBLE:
        this.attr('modalContent', {
          title: "Author note:",
          text: "Document Assembly would happen here.  Use Test Assemble under the Templates tab to assemble in A2J Author"
        });
        break;

      case constants.qIDSUCCESS:
      this.attr('modalContent', {
        title: "Author note:",
        text: "User's data would upload to the server."
      });
      break;
      case constants.qIDASSEMBLESUCCESS:
        this.attr('modalContent', {
          title: "Author note:",
          text: "User's data would upload to the server, then assemble their document.  Use Test Assemble under the Templates tab to assemble in A2J Author"
        });
        break;
    }
  },

  _setPage(page, gotoPage) {
    const rState = this.attr('rState');
    const repeatVar = page.attr('repeatVar');
    const answers = this.attr('interview.answers');
    const countVarName = (repeatVar || '').toLowerCase();

    const answer = answers.attr(countVarName);
    const i = answer ? (new AnswerVM({ answer })).attr('values') : null;

    if (i) {
      rState.attr({ page: gotoPage, i: parseInt(i, 10) });
    } else {
      rState.removeAttr('i');
      rState.attr('page', gotoPage);
    }

  },

  setCurrentPage() {
    const pageName = this.attr('rState.page');

    if (pageName && pageName !== 'FAIL') {
      const page = this.attr('interview.pages').find(pageName);

      if (!page) {
        console.warn(`Unknown page: ${pageName}`);
        return;
      }

      can.batch.start();

      this.attr('traceLogic').push({ page: page.attr('name') });
      this.attr('currentPage', page);
      this.setFieldAnswers(page.attr('fields'));
      this.attr('mState.header', page.attr('step.text'));
      this.attr('mState.step', page.attr('step.number'));

      can.batch.stop();
    }
  },

  /**
   * @function pages.ViewModel.prototype.__ensureFieldAnswer __ensureFieldAnswer
   * @parent pages.ViewModel
   *
   * Returns an Answer instance of the given field name.
   *
   * This method takes a `field` model instance and checks if there is an
   * `answer` object already set in the `interview.answers` list, if that's
   * the case the object is returned, otherwise an empty answer is created
   * using the `field` data, that answer is set to the answers list and returned.
   *
   * ** This is doing too many things, it probably does not belong here either.
   */
  __ensureFieldAnswer(field) {
    const name = field.attr('name').toLowerCase();
    const answers = this.attr('interview.answers');

    let answer = answers.attr(name);

    if (answer) {
      return answer;
    } else {
      answer = field.attr('emptyAnswer');
      answers.attr(name, answer);
      return answer;
    }
  },

  setFieldAnswers(fields) {
    const logic = this.attr('logic');
    const page = this.attr('currentPage');

    if (logic && fields.length) {
      let answerIndex = 1;
      const rState = this.attr('rState');
      const mState = this.attr('mState');

      if (page.attr('repeatVar')) {
        const repeatVar = logic.varGet('repeatVar');
        const repeatVarCount = logic.varGet(repeatVar);

        answerIndex = (repeatVarCount != null) ? repeatVarCount : answerIndex;
      }

      fields.each(field => {
        const answer = this.__ensureFieldAnswer(field);
        const avm = new AnswerVM({ field, answerIndex, answer, fields });

        if (page.attr('repeatVar') && rState.attr('i')) {
          avm.attr('answerIndex', parseInt(rState.attr('i'), 10));
        }

        if (field.attr('type') === 'textpick') {
          field.getOptions(mState.attr('fileDataURL'));
        }

        // Assign default value if it exists and no previous answer
        if (field.value && !avm.attr('answer.values.'+answerIndex)) {
          // Default values used differently or not at all for these field types
          if (field.type !== constants.ftRadioButton &&
              field.type !== constants.ftCheckBox &&
              field.type !== constants.ftCheckBoxNOTA &&
              field.type !== constants.ftGender)
          {
            avm.attr('answer.values.'+answerIndex, field.value);
          }
        }

        field.attr('_answer', avm);
      });
    }
  },

  setRepeatVariable(repeatVar, repeatVarSet) {
    const logic = this.attr('logic');
    const traceLogic = this.attr('traceLogic');

    let traceLogicMsg = {};

    if (!logic.varExists('repeatVar')) {
      logic.varCreate('repeatVar', 'Text', false, 'Repeat variable name');
    }

    logic.varSet('repeatVar', repeatVar);

    switch (repeatVarSet) {
      case constants.RepeatVarSetOne:
        if (!logic.varExists(repeatVar)) {
          logic.varCreate(repeatVar, 'Number', false, 'Repeat variable index');
        }

        logic.varSet(repeatVar, 1);
        traceLogicMsg[repeatVar + '-0'] = { msg: 'Setting [' + repeatVar + '] to 1' };
        traceLogic.push(traceLogicMsg);
        break;

      case constants.RepeatVarSetPlusOne:
        const value = logic.varGet(repeatVar);

        logic.varSet(repeatVar, value + 1);
        traceLogicMsg[repeatVar + '-' + value] = { msg: 'Incrementing [' + repeatVar + '] to ' + (value + 1) };
        traceLogic.push(traceLogicMsg);
        break;
    }
  },

  changePage: function(rState, newPageName) {
    const vm = this;

    // navigation via navbar skips logic
    if (rState.attr('forceNavigation')) {
      vm.setCurrentPage();
      rState.attr('forceNavigation', false);
      return;
    }

    // Navigate to the exitURL if the page is set to a
    // non-undefined falsy or the explicit "FAIL" string
    if ((! newPageName && typeof newPageName !== 'undefined') || newPageName === 'FAIL') {
      let exitURL = vm.attr('mState.exitURL');

      //TODO: This shouldn't be necessary, however something
      //else is being executed.
      setTimeout(function() {
        window.location = exitURL;
      });

      return;
    }

    // // Next page is unknown page name
    let nextPage = vm.attr('interview.pages').find(newPageName);
    if (!nextPage) return;

    let logic = vm.attr('logic');

    var gotoPage = logic.attr('gotoPage');
    // If this has value, we are exiting the interview
    var lastPageBeforeExit = rState.attr('lastPageBeforeExit');

    if (logic.attr('infinite').errors()) {
      vm.attr('traceLogic').push({
        'infinite loop': {
          format: 'info',
          msg: 'Possible infinite loop. Too many page jumps without user interaction'
        }
      });
      vm.attr('rState.page', '__error');
    } else if (gotoPage && gotoPage.length && !lastPageBeforeExit) {

      logic.attr('infinite').inc();
      vm._setPage(nextPage, gotoPage);
    } else {
      logic.attr('infinite').reset();
    }

    vm.setCurrentPage();
  }
});

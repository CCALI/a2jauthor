import Map from 'can/map/';
import _some from 'lodash/some';
import AnswerVM from 'viewer/models/answervm';
import constants from 'viewer/models/constants';

import 'can/map/define/';
import 'bootstrap/js/modal';

/**
 * @property {can.Map} pages.ViewModel
 * @parent viewer/mobile/pages/
 *
 * `<a2j-pages>` viewModel.
 */
export default Map.extend({
  define: {
    currentPage: {
      value: null
    },

    modalContent: {
      value: null
    },

    traceLogic: {
      value: []
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
        const answers = this.attr('interview.answers');
        return JSON.stringify(answers.serialize());
      }
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

  onSuccessBtnClick() {
    const savePromise = this.attr('pState').save();

    savePromise.done(url => {
      const step = '';
      const header = '';
      const redirect = url;

      this.attr('mState').attr({ step, header, redirect });
      this.attr('rState').attr({ view: 'complete' }, true);
    });
  },

  navigate(button) {
    const repeatVar = button.attr('repeatVar');
    const fields = this.attr('currentPage.fields');
    const repeatVarSet = button.attr('repeatVarSet');

    this.traceButtonClicked(button.attr('label'));

    if (repeatVar && repeatVarSet) {
      this.setRepeatVariable(repeatVar, repeatVarSet);
    }

    this.validateAllFields();
    const anyFieldWithError = _some(fields, f => f.attr('hasError'));

    if (!anyFieldWithError) {
      const logic = this.attr('logic');
      const gotoPage = logic.attr('gotoPage');
      const codeAfter = this.attr('currentPage.codeAfter');

      if (codeAfter) {
        this.traceLogicAfterQuestion();
        logic.exec(codeAfter);
      }

      if (gotoPage && gotoPage.length) {
        logic.attr('gotoPage', null);
        this._setPage(this.attr('currentPage'), gotoPage);
      } else if (button.next === 'ASSEMBLE') {
        this.onAssembleBtnClick();
      } else {
        this._setPage(this.attr('currentPage'), button.next);
      }
    }
  },

  _setPage(page, gotoPage) {
    const rState = this.attr('rState');
    const repeatVar = page.attr('repeatVar');

    const answer = this.attr(`interview.answers.${repeatVar}`);
    const i = answer ? new AnswerVM({ answer }).attr('values') : null;

    if (i) {
      rState.attr({
        page: gotoPage,
        i: +i
      });
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

      this.attr('traceLogic').push({
        page: page.attr('name')
      });

      this.attr('currentPage', page);
      this.setFieldAnswers(page.attr('fields'));
      this.attr('mState.header', page.attr('step.text'));
      this.attr('mState.step', page.attr('step.number'));
    }
  },

  setFieldAnswers(fields) {
    const logic = this.attr('logic');
    const repeatVar = logic && logic.varGet('repeatVar');
    const repeatVarCount = logic && logic.varGet(repeatVar);
    const answerIndex = repeatVarCount ? repeatVarCount : 1;

    fields.each(field => {
      const avm = new AnswerVM({
        field,
        answerIndex,
        answer: field.attr('answer'),
      });

      if (this.attr('rState.i')) {
        avm.attr('answerIndex', +this.attr('rState.i'));
      }

      if (field.attr('type') === 'textpick') {
        field.getOptions();
      }

      field.attr('_answer', avm);
    });
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
        traceLogicMsg[repeatVar + '-0'] = { msg: 'Setting repeat variable to 1' };
        traceLogic.push(traceLogicMsg);
        break;

      case constants.RepeatVarSetPlusOne:
        const value = logic.varGet(repeatVar);

        logic.varSet(repeatVar, value + 1);
        traceLogicMsg[repeatVar + '-' + value] = { msg: 'Incrementing repeat variable' };
        traceLogic.push(traceLogicMsg);
        break;
    }
  }
});

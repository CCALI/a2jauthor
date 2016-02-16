import Map from 'can/map/';
import AnswerVM from 'viewer/models/answervm';
import constants from 'viewer/models/constants';

import 'can/map/define/';
import 'bootstrap/js/modal';

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
    }
  },

  init() {
    this.setCurrentPage();
  },

  home() {
    this.attr('rState').attr({}, true);
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
    const fields = this.attr('currentPage.fields');
    const repeatVar = button.attr('repeatVar');
    const repeatVarSet = button.attr('repeatVarSet');

    this.attr('traceLogic').push({
      button: [
        { msg: 'You pressed' },
        { format: 'ui', msg: button.attr('label') }
      ]
    });

    if (repeatVar && repeatVarSet) {
      this.setRepeatVariable(repeatVar, repeatVarSet);
    }

    let error = false;

    can.each(fields, function(field) {
      const hasError = !!field.attr('_answer').errors();

      field.attr('hasError', hasError);

      if (hasError) {
        error = true;
        return false;
      }
    });

    if (!error) {
      const logic = this.attr('logic');

      if (this.attr('currentPage.codeAfter')) {
        this.attr('traceLogic').push({
          codeAfter: { format: 'info', msg: 'Logic After Question' }
        });

        logic.exec(this.attr('currentPage.codeAfter'));
      }

      const gotoPage = logic.attr('gotoPage');

      if (gotoPage && gotoPage.length) {
        logic.attr('gotoPage', null);
        this._setPage(this.attr('currentPage'), gotoPage);
      } else if (button.next === 'SUCCESS') {
        this.onSuccessBtnClick();
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

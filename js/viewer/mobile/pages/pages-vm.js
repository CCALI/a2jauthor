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

  navigate(button) {
    let error = false;
    let fields = this.attr('currentPage.fields');

    this.attr('traceLogic').push({
      button: [
        { msg: 'You pressed' },
        { format: 'ui', msg: button.attr('label') }
      ]
    });

    can.each(fields, function(field) {
      let errors = field.attr('_answer').errors();
      field.attr('hasError', !!errors);

      if (errors) error = true;
    });

    if (!error) {
      let logic = this.attr('logic');

      if (this.attr('currentPage.codeAfter')) {
        this.attr('traceLogic').push({
          codeAfter: { format: 'info', msg: 'Logic After Question' }
        });
        logic.exec(this.attr('currentPage.codeAfter'));
      }

      let repeatVar = button.repeatVar;
      let traceLogic = {};
      switch(button.repeatVarSet) {
        case '=1':
          if (!logic.varExists(repeatVar)) {
            logic.varCreate(repeatVar, "Number", false, 'Repeat variable index');
          }
          logic.varSet(repeatVar, 1);
          traceLogic[repeatVar + '-0'] = { msg: 'Setting repeat variable to 1' };
          this.attr('traceLogic').push(traceLogic);
          break;
        case '+=1':
          var value = logic.varGet(repeatVar);
          logic.varSet(repeatVar, value + 1);
          traceLogic[repeatVar + '-' + value] = { msg: 'Incrementing repeat variable' };
          this.attr('traceLogic').push(traceLogic);
          break;
      }

      let gotoPage = logic.attr('gotoPage');
      if (gotoPage && gotoPage.length) {
        logic.attr('gotoPage', null);
        this._setPage(this.attr('currentPage'), gotoPage);
      }
      else if (button.next === 'SUCCESS') {
        let self = this;
        let completed = new AnswerVM({
          answer: this.attr('pState.answers.' + constants.vnInterviewIncompleteTF.toLowerCase())
        });

        completed.attr('values', false);
        var dfd = this.attr('pState').save();
        dfd.done(function(url) {
          self.attr('mState').attr({
            redirect: url,
            header: '',
            step: ''
          });
          self.attr('rState').attr({ view: 'complete' }, true);
        });
      }
      else {
        this._setPage(this.attr('currentPage'), button.next);
      }
    }
  },

  _setPage(page, gotoPage) {
    let rState = this.attr('rState');
    let answer = this.attr('interview.answers.' + page.attr('repeatVar'));
    let i = answer ? new AnswerVM({ answer: answer }).attr('values') : null;

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
    let pageName = this.attr('rState.page');

    if (pageName && pageName !== 'FAIL') {
      let page = this.attr('interview.pages').find(pageName);

      if (!page) {
        console.warn(`Unknown page: ${pageName}`);
        return;
      }

      this.attr('traceLogic').push({
        page: page.attr('name')
      });

      let fields = page.attr('fields');

      this.attr('mState.header', page.attr('step.text'));
      this.attr('mState.step', page.attr('step.number'));

      fields.each(field => {
        var avm = new AnswerVM({
          field: field,
          answer: field.attr('answer')
        });

        if (this.attr('rState.i')) {
          avm.attr('answerIndex', +this.attr('rState.i'));
        }

        if (field.attr('type') === 'textpick') {
          field.getOptions();
        }

        field.attr('_answer', avm);
      });

      this.attr('currentPage', page);
    }
  }
});

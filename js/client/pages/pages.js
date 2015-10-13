import PagesVM from './pages-vm';
import Component from 'can/component/';
import template from './pages.stache!';
import AnswerVM from 'client/models/answervm';
import constants from 'client/models/constants';

import 'client/util/helpers';
import 'client/pages/fields/';

export default Component.extend({
  template,
  tag: 'a2j-pages',
  viewModel: PageVM,

  helpers: {
    page: function(page, options) {
      page = typeof page === 'function' ? page() : page;

      if (page && page !== 'FAIL') {
        let self = this;
        let p = this.attr('interview.pages').find(page);
        let fields = p.attr('fields');

        this.attr('mState.header', p.attr('step.text'));
        this.attr('mState.step', p.attr('step.number'));
        this.attr('currentPage', p);

        can.each(fields, function(field) {
          var avm = new AnswerVM({
            answer: field.attr('answer'),
            field: field
          });

          if (self.attr('rState.i')) {
            avm.attr('answerIndex', +self.attr('rState.i'));
          }

          if (field.attr('type') === 'textpick') {
            field.getOptions();
          }

          field.attr('_answer', avm);
        });

        return options.fn(this.attr('currentPage'));
      }
    }
  },

  events: {
    'a:regex(href,popup\://) click': function(el, ev) {
      ev.preventDefault();
      var p = this.scope.attr('interview.pages').find(el[0].pathname.replace('//', ''));
      this.scope.attr('popupPage', p);

      this.element.find('#pageModal').modal();
    },

    '{rState} page': function(rState, ev, val, old) {
      if (!val || val === 'FAIL') {
        var url = this.scope.attr('mState.exitURL');

        //TODO: This shouldn't be necessary, however something
        //else is being executed.
        setTimeout(function() {
          window.location = url;
        });

        return;
      }

      let logic = this.scope.attr('logic');
      let p = this.scope.attr('interview.pages').find(val);

      logic.exec(p.attr('codeBefore'));
      var gotoPage = logic.attr('gotoPage');

      if (logic.attr('infinite').errors()) {
        this.scope.attr('rState.page', '__error');
      }
      else if (gotoPage && gotoPage.length) {
        logic.attr('infinite').inc();
        this.scope._setPage(p, gotoPage);
      }
      else {
        logic.attr('infinite').reset();
      }
    },

    '#pageModal hidden.bs.modal': function(el, ev) {
      this.scope.attr('popupPage', null);
    }
  }
});

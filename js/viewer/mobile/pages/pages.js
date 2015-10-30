import PagesVM from './pages-vm';
import Component from 'can/component/';
import template from './pages.stache!';
import AnswerVM from 'viewer/models/answervm';

import 'viewer/mobile/util/helpers';

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-pages',
  viewModel: PagesVM,

  events: {
    'a:regex(href,popup\://) click': function(el, ev) {
      ev.preventDefault();
      var p = this.scope.attr('interview.pages').find(el[0].pathname.replace('//', ''));
      this.scope.attr('popupPage', p);

      this.element.find('#pageModal').modal();
    },

    '{rState} page': function(rState, ev, val, old) {
      let vm = this.viewModel;

      if (!val || val === 'FAIL') {
        let exitURL = vm.attr('mState.exitURL');

        //TODO: This shouldn't be necessary, however something
        //else is being executed.
        setTimeout(function() {
          window.location = exitURL;
        });

        return;
      }

      let logic = vm.attr('logic');
      let p = vm.attr('interview.pages').find(val);

      // unknown page name
      if (!p) return;

      logic.exec(p.attr('codeBefore'));
      var gotoPage = logic.attr('gotoPage');

      if (logic.attr('infinite').errors()) {
        vm.attr('rState.page', '__error');
      } else if (gotoPage && gotoPage.length) {
        logic.attr('infinite').inc();
        vm._setPage(p, gotoPage);
      } else {
        logic.attr('infinite').reset();
      }

      vm.setCurrentPage();
    },

    '#pageModal hidden.bs.modal': function(el, ev) {
      this.scope.attr('popupPage', null);
    }
  }
});

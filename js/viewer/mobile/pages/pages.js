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
      this.viewModel.attr('modalContent', p);
    },

    '{window} traceLogic': function(el, ev, msg) {
      this.viewModel.attr('traceLogic').push(msg);
    },

    'a click': function(el) {
      el.attr('target', '_blank');
    },

    '{rState} page': function(rState, ev, val) {
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

      if (p.attr('codeBefore')) {
        vm.attr('traceLogic').push({
          codeBefore: { format: 'info', msg: 'Logic Before Question'}
        });
        logic.exec(p.attr('codeBefore'));
      }
      var gotoPage = logic.attr('gotoPage');

      if (logic.attr('infinite').errors()) {
        this.viewModel.attr('traceLogic').push({
          'infinite loop': {
            format: 'info',
            msg: 'Possible infinite loop. Too many page jumps without user interaction'
          }
        });
        vm.attr('rState.page', '__error');
      } else if (gotoPage && gotoPage.length) {
        let traceLogic = {};
        let counter = logic.attr('infinite._counter');
        let traceLogicMsg =  (counter === 0) ? 'Setting repeat variable to 1' : 'Incrementing repeat variable';
        traceLogic['infinite-' + counter] = { msg: traceLogicMsg };
        this.viewModel.attr('traceLogic').push(traceLogic);

        logic.attr('infinite').inc();
        vm._setPage(p, gotoPage);
      } else {
        logic.attr('infinite').reset();
      }

      vm.setCurrentPage();
    },


    /*
    * when value of repeatVar changes, re-render page fields
    */
    '{rState} repeatVarValue': function(rState, ev, val) {
      let fields = this.viewModel.attr('currentPage.fields');
      this.viewModel.setFieldAnswers(fields);
    }
  }
});

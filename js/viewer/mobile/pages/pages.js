import PagesVM from './pages-vm';
import Component from 'can/component/';
import template from './pages.stache!';

import 'viewer/mobile/util/helpers';

/**
 * @module {Module} viewer/mobile/pages/ <a2j-pages>
 * @parent api-components
 *
 * This component renders each of the interview pages and handle the
 * navigation between those pages.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-pages
 *     {lang}="lang"
 *     {(logic)}="logic"
 *     {(r-state)}="routeState"
 *     {(m-state)}="memoryState"
 *     {(interview)}="interview"
 *     {(p-state)}="persistedState" />
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'a2j-pages',
  leakScope: false,
  viewModel: PagesVM,

  helpers: {
    buttonLabelOrDefault(label) {
      return label ? label : this.attr('lang').attr('Continue');
    }
  },

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

    // when value of repeatVar changes, re-render page fields
    '{rState} repeatVarValue': function() {
      const vm = this.viewModel;
      const fields = vm.attr('currentPage.fields');

      vm.setFieldAnswers(fields);
    }
  }
});

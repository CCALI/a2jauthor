import PagesVM from './pages-vm';
import Component from 'can/component/';
import template from './pages.stache!';
import assembleFormTpl from './assemble-form.stache!';
import saveAnswersFormTpl from './save-answers-form.stache!';

import 'can/view/';
import 'viewer/mobile/util/helpers';

can.view.preload('assemble-form', assembleFormTpl);
can.view.preload('save-answers-form', saveAnswersFormTpl);

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
    getButtonLabel(label) {
      return label ? label : this.attr('lang').attr('Continue');
    }
  },

  events: {
    'a:regex(href,popup\://) click': function(el, ev) {
      ev.preventDefault();

      const vm = this.viewModel;
      const pages = vm.attr('interview.pages');

      if (pages) {
        const pageName = el.get(0).pathname.replace('//', '');
        const page = pages.find(pageName);
        // popups only have name, text, textAudioURL possible values
        vm.attr('modalContent', {
          title: page.name,
          text: page.text,
          audioURL: page.textAudioURL
        });
      }
    },

    '{window} traceLogic': function(el, ev, msg) {
      this.viewModel.attr('traceLogic').push(msg);
    },

    'a click': function(el) {
      el.attr('target', '_blank');
    },

    // This event is fired when the Exit, Success, or AssembleSuccess button is clicked,
    // it waits to asynchronously submit the form that posts the XML asnwers
    // to the `setDataURL` endpoint.
    '{viewModel} post-answers-to-server': function() {
      const $form = this.element.find('.post-answers-form');

      setTimeout(function() {
        $form.submit();
      });
    },

    // when value of repeatVar changes, re-render page fields
    '{rState} repeatVarValue': function() {
      const vm = this.viewModel;
      const fields = vm.attr('currentPage.fields');

      vm.setFieldAnswers(fields);
    },

    '{rState} page': function(rState, ev, val) {
      const vm = this.viewModel;

      if (rState.attr('forceNavigation')) {
        vm.setCurrentPage();
        return;
      }
      // Navigate to the exitURL if the page is set to a
      // non-undefined falsy or the explicit "FAIL" string
      if ((! val && typeof val !== 'undefined') || val === 'FAIL') {
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
      // If this has value, we are exiting the interview
      var lastPageBeforeExit = rState.attr('lastPageBeforeExit');

      if (logic.attr('infinite').errors()) {
        this.viewModel.attr('traceLogic').push({
          'infinite loop': {
            format: 'info',
            msg: 'Possible infinite loop. Too many page jumps without user interaction'
          }
        });
        vm.attr('rState.page', '__error');
      } else if (gotoPage && gotoPage.length && !lastPageBeforeExit) {

        logic.attr('infinite').inc();
        vm._setPage(p, gotoPage);
      } else {
        logic.attr('infinite').reset();
      }

      vm.setCurrentPage();
    }
  }
});

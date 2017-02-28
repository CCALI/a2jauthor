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
    'inserted': function() {
      let stateTraceLogic = this.viewModel.attr("rState.traceLogic");
      let traceLogic = this.viewModel.attr("traceLogic");

      if(stateTraceLogic) {
        let finalTraceLogic = stateTraceLogic.concat(traceLogic);
        this.viewModel.attr("traceLogic", finalTraceLogic);
        var vm = this.viewModel;
        stateTraceLogic.bind('change', function(ev, index, action, elements) {
          vm.attr("traceLogic").push(elements[0]);
        });
      }
    },

    'a.learn-more click': function(el, ev) {
      ev.preventDefault();

      const vm = this.viewModel;
      const pages = vm.attr('interview.pages');
      const pageName = vm.attr('rState.page');

      if (pages && pageName) {
        const page = pages.find(pageName);

        vm.attr('modalContent', {
          title: page.learn,
          text: page.help,
          imageURL: page.helpImageURL,
          audioURL: page.helpAudioURL,
          videoURL: page.helpVideoURL
        });
      }
    },

    'a:regex(href,popup\://) click': function(el, ev) {
      ev.preventDefault();

      const vm = this.viewModel;
      const pages = vm.attr('interview.pages');

      if (pages) {
        const pageName = $(el.get(0)).attr("href").replace("popup://", "").replace("POPUP://", "").replace("/", ""); //pathname is not supported in FF and IE.
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

      // keep answer index in sync with repeatVarValue
      // when a user is navigating via the nav bar
      const rState = this.viewModel.attr('rState');
      const repeatVarValue = rState.attr('repeatVarValue');

      if (rState && repeatVarValue) {
        rState.attr('i', repeatVarValue);
      }

      vm.setFieldAnswers(fields);
    },

    '{rState} page': function(rState, ev, newPageName) {
      this.viewModel.changePage(rState, newPageName);
    }

  }
});

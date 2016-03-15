import Map from 'can/map/';
import _assign from 'lodash/assign';
import Component from 'can/component/';
import isMobile from 'viewer/is-mobile';
import template from 'viewer/app.stache!';
import Lang from 'viewer/mobile/util/lang';
import Logic from 'viewer/mobile/util/logic';
import AppState from 'viewer/models/app-state';
import Interview from 'viewer/models/interview';
import MemoryState from 'viewer/models/memory-state';
import PersistedState from 'viewer/models/persisted-state';
import parseGuideToMobile from 'viewer/mobile/util/guide-to-mobile';

const ViewerPreviewVM = Map.extend({});

export default Component.extend({
  tag: 'a2j-viewer-preview',
  viewModel: ViewerPreviewVM,

  events: {
    inserted() {
      const vm = this.viewModel;
      const rState = new AppState();
      const mState = new MemoryState();
      const pState = new PersistedState();

      // Set fileDataUrl to window.gGuidePath, so the viewer can locate the
      // interview assets (images, sounds, etc).
      mState.attr('fileDataURL', vm.attr('guidePath'));

      const mobileData = parseGuideToMobile(_assign({}, window.gGuide));
      const parsedData = Interview.parseModel(mobileData);
      const interview = new Interview(parsedData);
      const lang = new Lang(interview.attr('language'));

      const answers = pState.attr('answers');
      answers.attr('lang', lang);
      answers.attr(can.extend({}, interview.serialize().vars));

      interview.attr('answers', answers);
      rState.attr('interview', interview);

      // needs to be created after answers are set
      const logic = new Logic({ interview });
      rState.attr('logic', logic);

      // if previewPageName is set, we need to make sure the viewer
      // loads that specific page (covers the case when user clicks
      // `preview` from the edit page popup).
      if (vm.attr('previewPageName')) {
        rState.attr({
          view: 'pages',
          page: vm.attr('previewPageName')
        });
      } else {
        rState.attr('view', 'intro');
      }

      // hack to keep `interviewPageName` in sync with author app.
      vm.attr('interviewPageName', rState.attr('page'));
      rState.bind('page', function() {
        vm.attr('interviewPageName', rState.attr('page'));
      });

      const modalContent = can.compute();

      vm.attr({
        rState, pState, mState, interview,
        logic, lang, isMobile, modalContent
      });

      this.element.html(template(vm));
    }
  }
});

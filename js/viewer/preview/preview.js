import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import isMobile from 'viewer/is-mobile';
import template from 'viewer/app.stache!';
import Lang from 'viewer/mobile/util/lang';
import _extend from 'lodash/object/extend';
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
      let vm = this.viewModel;
      let rState = new AppState();
      let mState = new MemoryState();
      let pState = new PersistedState();

      let mobileData = parseGuideToMobile(_extend({}, window.gGuide));
      let parsedData = Interview.parseModel(mobileData);
      let interview = new Interview(parsedData);

      let logic = new Logic({interview});
      let lang = new Lang(interview.attr('language'));

      rState.attr('interview', interview);

      // if pageName is set, we need to make sure the viewer loads
      // that specific page (covers the case when user clicks `preview`
      // from the edit page popup).
      if (vm.attr('pageName')) {
        rState.attr({
          view: 'pages',
          page: vm.attr('pageName')
        });
      } else {
        rState.attr('view', 'intro');
      }

      vm.attr({
        rState, pState, mState,
        interview, logic, lang, isMobile
      });

      this.element.html(template(vm));
    }
  }
});

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
import setVisitedPages from 'viewer/models/visited-pages';
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

      rState.attr('view', 'intro');
      setVisitedPages(rState, interview);

      vm.attr({
        rState, pState, mState,
        interview, logic, lang, isMobile
      });

      this.element.html(template(vm));
    }
  }
});

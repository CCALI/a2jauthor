import can from 'can';
import $ from 'jquery';
import isMobile from './is-mobile';
import config from 'viewer/config/';
import template from './app.stache!';
import Lang from 'viewer/mobile/util/lang';
import Answers from 'viewer/models/answers';
import Logic from 'viewer/mobile/util/logic';
import AppState from 'viewer/models/app-state';
import constants from 'viewer/models/constants';
import Interview from 'viewer/models/interview';
import MemoryState from 'viewer/models/memory-state';
import setVisitedPages from 'viewer/models/visited-pages';
import PersistedState from 'viewer/models/persisted-state';

import 'can/route/';
import 'viewer/mobile/';
import 'viewer/desktop/';
import 'jquerypp/dom/cookie/';
import './styles/styles.less!';
import 'viewer/mobile/util/helpers';

// State attrs not needing persistance, such as showing/hiding the table of contents.
// Load configuration from desktop into mobile
let mState = new MemoryState(config);

// AJAX request for interview json
let iDfd = Interview.findOne({
  url: mState.attr('templateURL'),
  resume: mState.attr('getDataURL')
});

// Local storage request for any existing answers
let pDfd = PersistedState.findOne();

// Route state
let rState = new AppState();

can.route('', { view: 'intro' });
can.route('view/:view/page/:page');
can.route('view/:view/page/:page/:i');
can.route.map(rState);

$.when(iDfd, pDfd).then(function(interview, pState) {
  can.route.ready();

  pState = pState || new PersistedState();
  pState.attr('setDataURL', mState.attr('setDataURL'));
  pState.attr('autoSetDataURL', mState.attr('autoSetDataURL'));

  let lang = new Lang(interview.attr('language'));
  let answers = pState.attr('answers');

  answers.attr(can.extend({}, interview.serialize().vars));
  answers.attr(constants.vnInterviewIncompleteTF.toLowerCase(), {
    name: constants.vnInterviewIncompleteTF.toLowerCase(),
    type: constants.vtTF,
    values: [null, true]
  });
  answers.attr('lang', lang);

  interview.attr('answers', answers);
  let logic = new Logic({
    interview: interview
  });

  pState.backup();

  rState.bind('change', function(ev, attr, how, val, old) {
    if (attr === 'page' && val) {
      pState.attr('currentPage', val);
    }
  });

  // makes sure `rState` has a list of the pages visited by the user, this
  // logic is implemented as an independent module because setting `interview`
  // to `rState` breaks `a2j-pages`, possibly due to viewModel/scope issues.
  setVisitedPages(rState, interview);

  $('#viewer-app').append(template({
    rState: rState,
    pState: pState,
    mState: mState,
    interview: interview,
    logic: logic,
    lang: lang,
    isMobile: isMobile
  }));
});

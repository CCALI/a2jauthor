import can from 'can';
import $ from 'jquery';
import isMobile from './is-mobile';
import config from 'viewer/config/';
import template from './app.stache!';
import _isEmpty from 'lodash/isEmpty';
import Lang from 'viewer/mobile/util/lang';
import Logic from 'viewer/mobile/util/logic';
import AppState from 'viewer/models/app-state';
import constants from 'viewer/models/constants';
import Interview from 'viewer/models/interview';
import MemoryState from 'viewer/models/memory-state';
import PersistedState from 'viewer/models/persisted-state';
import setMobileDesktopClass from 'viewer/util/set-mobile-desktop-class';

import 'can/route/';
import 'jquerypp/dom/cookie/';
import 'viewer/mobile/util/helpers';

// State attrs not needing persistance, such as showing/hiding the table of contents.
// Load configuration from desktop into mobile
let qsParams = can.deparam(window.location.search.substring(1));
let mState = new MemoryState(_isEmpty(qsParams) ? config : qsParams);

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
can.route('view/:view/page/:page/:repeatVarValue');
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

  rState.attr('interview', interview);
  setMobileDesktopClass(isMobile, $('body'));

  rState.attr('logic', logic);

  let modalContent = can.compute();

  $('#viewer-app').append(template({
    rState, pState, mState, interview, logic, lang, isMobile, modalContent
  }));
});

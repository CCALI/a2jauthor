import can from 'can';
import $ from 'jquery';
import Lang from 'client/util/lang';
import template from './app.stache!';
import Logic from 'client/util/logic';
import Answers from 'client/models/answers';
import constants from 'client/models/constants';
import Interview from 'client/models/interview';
import MemoryState from 'client/models/memory-state';
import PersistedState from 'client/models/persisted-state';

import 'can/route/';
import 'client/util/helpers';
import 'client/screen-manager/';
import 'jquerypp/dom/cookie/';

// State attrs not needing persistance, such as showing/hiding the table of contents.
// Load configuration from desktop into mobile
let mState = new MemoryState(can.deparam(window.location.search.substring(1)));

// AJAX request for interview json
let iDfd = Interview.findOne({
  url: mState.attr('templateURL'),
  resume: mState.attr('getDataURL')
});

// Local storage request for any existing answers
let pDfd = PersistedState.findOne();

// Route state
let rState = new can.Map();

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

  $('body').append(template({
    rState: rState,
    pState: pState,
    mState: mState,
    interview: interview,
    logic: logic,
    lang: lang
  }));
});

import can from 'can';
import $ from 'jquery';
import template from './app.stache!';
import Lang from 'viewer/mobile/util/lang';
import Logic from 'viewer/mobile/util/logic';
import Answers from 'viewer/mobile/models/answers';
import constants from 'viewer/mobile/models/constants';
import Interview from 'viewer/mobile/models/interview';
import MemoryState from 'viewer/mobile/models/memory-state';
import PersistedState from 'viewer/mobile/models/persisted-state';

import 'can/route/';
import 'jquerypp/dom/cookie/';
import 'viewer/mobile/util/helpers';
import 'viewer/mobile/screen-manager/';
import 'bootstrap/dist/css/bootstrap.css!';

export let render = function() {
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

    $('#viewer-app').append(template({
      rState: rState,
      pState: pState,
      mState: mState,
      interview: interview,
      logic: logic,
      lang: lang
    }));
  });
};

// render the app the first time this file is loaded.
render();

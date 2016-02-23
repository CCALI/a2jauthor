import can from 'can';
import startApp from './start-app';
import config from 'viewer/config/';
import _isEmpty from 'lodash/isEmpty';
import AppState from 'viewer/models/app-state';
import Interview from 'viewer/models/interview';
import MemoryState from 'viewer/models/memory-state';
import PersistedState from 'viewer/models/persisted-state';

import 'can/route/';
import 'jquerypp/dom/cookie/';
import 'viewer/mobile/util/helpers';

// State attrs not needing persistance, such as showing/hiding the table of contents.
// Load configuration from desktop into mobile
const qsParams = can.deparam(window.location.search.substring(1));
const mState = new MemoryState(_isEmpty(qsParams) ? config : qsParams);

// AJAX request for interview json
const interviewPromise = Interview.findOne({
  url: mState.attr('templateURL'),
  resume: mState.attr('getDataURL')
});

// Local storage request for any existing answers
const persistedStatePromise = PersistedState.findOne();

// Route state
const rState = new AppState();

can.route('', { view: 'intro' });
can.route('view/:view/page/:page');
can.route('view/:view/page/:page/:repeatVarValue');
can.route.map(rState);

Promise.all([interviewPromise, persistedStatePromise])
  .then(function([interview, pState]) {
    startApp({interview, pState, mState, rState});
  });

import $ from 'jquery';
import loader from '@loader';
import AppState from './models/app-state';
import tabsRouting from 'author/utils/tabs-routing';

import 'can/route/';

let appState = new AppState();

can.route.map(appState);
can.route(':page', {page: 'interviews'});
can.route(':page/:action', { action: 'view' });
can.route(':page/:action/:id');
can.route.ready();

$('body').on('click', 'a[href="#"]', ev => ev.preventDefault());

// this custom event is triggered when the user clicks the preview button
// in the edit page modal, since that code is not inside the CanJS app scope,
// the custom event is the way to let the CanJS app know that it needs to
// updated its state properly so the preview tab is rendered on the right page.
$(window).on('edit-page:preview', function(evt, pageName) {
  appState.attr('interviewPageName', pageName);
  appState.attr('page', 'preview');
  appState.attr('previewMode', true);
});

// The legacy code in src/src requires the dom to be populated in order to work,
// so we first render the main app's template and then load the code.
let loadLegacyCode = function() {
  return loader.import('author/src/');
};

let render = function({template}) {
  $('#author-app').html(template({appState}));
};

loader.import('author/app-template')
  .then(render)
  .then(loadLegacyCode)
  .then(() => tabsRouting(appState));

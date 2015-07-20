import $ from 'jquery';
import loader from '@loader';
import AppState from './models/app-state';
import tabsRouting from 'author/utils/tabs-routing';

import 'can/route/';
import 'author/styles/';
import 'author/main.less!';

import './header/';
import './footer/';
import './templates/';
import './interviews/';
import './vertical-navbar/';

let appState = new AppState();

can.route.map(appState);
can.route(':page', {page: 'interviews'});
can.route.ready();

$('body').on('click', 'a[href="#"]', ev => ev.preventDefault());

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

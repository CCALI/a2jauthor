import $ from 'jquery';
import loader from '@loader';
import isMobile from './is-mobile';
import config from 'viewer/app-config';

import 'jquerypp/dom/cookie/';

let firstTimeRender = true;
let cookie = $.cookie('useDesktop');
let useDesktop = cookie == null || cookie === 'true';

let loadApp = function() {
  $('#viewer-app').empty();

  // set config object as query string parameters without reloading the page
  if (window.history && 'replaceState' in window.history) {
    let href = window.location.href;
    window.history.replaceState(null, null, href + '?' + $.param(config));
  }

  return (isMobile() || !useDesktop)
    ? loader.import('viewer/mobile/app')
    : loader.import('viewer/desktop/app');
};

let reRender = function(module) {
  module.render();
};

isMobile.bind('change', function() {
  if (firstTimeRender) {
    loadApp();
  } else {
    loadApp().then(reRender);
  }

  // this flag is used to only re-render the app when
  // its code has already been loaded before.
  firstTimeRender = false;
});

loadApp();

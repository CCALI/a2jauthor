import $ from 'jquery';
import loader from '@loader';

import 'author/styles/';
import 'author/main.less!';

import './templates-tab/';
import './vertical-navbar/';

function loadLegacyCode() {
  return loader.import('author/src/');
}

function render({template}) {
  $('#author-app').html(template());
}

// The legacy code in src/src requires the dom to be populated in order to work,
// so we first render the main app's template and then load the code.
loader.import('author/app-template')
  .then(render)
  .then(loadLegacyCode);

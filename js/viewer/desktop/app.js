import $ from 'jquery';
import loader from '@loader';
import template from './app.stache!';
import _isFunction from 'lodash/lang/isFunction';

import './styles/';

// first time render
$(function() {
  $('#viewer-app').html(template());
  loader.import('viewer/desktop/src/');
});

// this function allows the caller to re-render the desktop app.
export let render = function() {
  $('#viewer-app').html(template());
  if (_isFunction(window.main)) window.main();
};

import $ from 'jquery';
import template from './index.stache!';

import 'author/styles/';
import 'author/src/';

import 'author/main.less!';
import './components/templates_tab/';

$('#tabsTemplate').html(template());

import $ from 'jquery';
import template from './index.stache!';

// import fixtures and app source files.
import 'author/models/fixtures/';
import 'author/src/';

import 'author/main.less!';
import './components/templates_tab/';

$('#tabsTemplate').html(template());

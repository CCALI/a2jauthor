import $ from 'jquery';
import template from './index.stache!';

import './main.less!';
import './components/templates_tab/';

$('#tabsTemplate').html(template());

import Component from 'can/component/';
import template from './templates-tab.stache!';

import './templates-tab.less!';


/**
 * @module {function} components/templates_tab/ <templates-tab>
 * @parent api-components
 * @signature `<templates-tab>`
 *
 * This component that will take care of the document assembly UI.
 */
Component.extend({
  template,
  tag: 'templates-tab'
});

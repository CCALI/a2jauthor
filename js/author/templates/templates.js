import Component from 'can/component/';
import template from './templates.stache!';

import './templates.less!';


/**
 * @module {function} components/templates/ <templates-page>
 * @parent api-components
 * @signature `<templates-page></templates-page>`
 *
 * This component that will take care of the document assembly UI.
 */
Component.extend({
  template,
  tag: 'templates-page'
});

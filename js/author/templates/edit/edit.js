import Map from 'can/map/';
import Component from 'can/component/';
import template from './edit.stache!';
import A2JTemplate from 'author/models/a2j-template';

import 'can/map/define/';

/**
 * @module {Module} author/templates/edit/ <template-edit-page>
 * @parent api-components
 *
 * Template's edit page main component. It takes care of fetching the template
 * data given a `templateId` or to create a new [A2JTemplate] if `templateId`'s
 * value is `new`.
 *
 * ## Use
 *
 * @codestart
 *   <template-edit-page {(guide)}="guide" {(template-id)}="id" {guide-id}="guideId" />
 * @codeend
 */

/**
 * @property {can.Map} editPage.ViewModel
 * @parent author/templates/edit/
 *
 * <template-edit-page>'s viewModel.
 */
export const TemplateEditPageVM = Map.extend({
  define: {
    /**
     * @property {Promise} editPage.ViewModel.prototype.a2jTemplatePromise a2jTemplatePromise
     * @parent editPage.ViewModel
     *
     * A promise object that will resolve either to a new empty template or to
     * an existing template.
     */
    a2jTemplatePromise: {
      get() {
        const templateId = this.attr('templateId');

        return templateId === 'new' ?
          this.makeNewTemplate() :
          A2JTemplate.findOne({ templateId });
      }
    },

    /**
     * @property {A2JTemplate} editPage.ViewModel.prototype.a2jTemplate a2jTemplate
     * @parent editPage.ViewModel
     *
     * This is an async property that will be set then [a2jTemplatePromise] resolves.
     */
    a2jTemplate: {
      get(last, set) {
        this.attr('a2jTemplatePromise').then(set);
      }
    }
  },

  /**
   * @function editPage.ViewModel.prototype.makeNewTemplate makeNewTemplate
   * @parent editPage.ViewModel
   * @return {A2JTemplate} A new A2JTemplate model instance.
   */
  makeNewTemplate() {
    const _this = this;
    const guideId = this.attr('guideId');

    const fn = can.__notObserve(function() {
      const template = new A2JTemplate({ guideId });

      return template.save().then(function(tpl) {
        const id = tpl.attr('templateId');

        _this.attr({
          action: 'edit',
          templateId: id
        });
      });
    });

    return fn();
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'template-edit-page',
  viewModel: TemplateEditPageVM
});

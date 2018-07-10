import CanMap from "can-map";
import Component from "can-component";
import template from "./edit.stache";
import A2JTemplate from "caja/author/models/a2j-template";
import A2JNode from "caja/author/models/a2j-node";

import "can-route";
import "can-map-define";

import { sharedPdfFlag } from "caja/author/pdf/index";

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
export const TemplateEditPageVM = CanMap.extend({
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
        const guideId = this.attr('guideId');
        if (templateId === 'new') {
          return this.makeNewTemplate();
        }

        return A2JTemplate.findOne({ guideId, templateId });
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
        this.attr("a2jTemplatePromise").then(set);
      }
    },

    isPdfTemplate: {
      get() {
        const template = this.attr("a2jTemplate");
        return (
          template && template.rootNode && template.rootNode.tag === "a2j-pdf"
        );
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
    const guideId = this.attr("guideId");
    const isPdfTemplate = sharedPdfFlag.get();
    sharedPdfFlag.clear();
    const defaultProps = { guideId };
    let templateProps = defaultProps;
    if (isPdfTemplate) {
      templateProps = $.extend(defaultProps, {
        rootNode: new A2JNode({ tag: "a2j-pdf" })
      });
    }

    const fn = can.__notObserve(function() {
      const template = new A2JTemplate(templateProps);
      return template.save().then(template => {
        const id = template.attr("templateId");
        _this.attr({
          action: "edit",
          templateId: id
        });
      });
    });

    return fn();
  }
});

export default Component.extend({
  view: template,
  leakScope: false,
  tag: "template-edit-page",
  ViewModel: TemplateEditPageVM
});

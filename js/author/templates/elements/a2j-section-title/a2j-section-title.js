import Map from 'can/map/';
import Component from 'can/component/';
import contentTpl from './content.stache!';
import template from './a2j-section-title.stache!';

import 'can/view/';

// preload stache partial
can.view.preload('section-title-content', contentTpl);

/**
 * @module {Module} author/templates/elements/a2j-section-title/ <a2j-section-title>
 * @parent api-components
 *
 * As it names suggestions, this component represents the main title of a section
 * in the generated document.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-section-title underline="true" title="Le important title!" />
 * @codeend
 */

/**
 * @property {can.Map} sectionTitle.ViewModel
 * @parent author/templates/elements/a2j-section-title/
 *
 * `<a2j-section-title>`'s viewModel.
 */
export let SectionTitleVM = Map.extend({
  define: {
    /**
     * @property {Boolean} sectionTitle.ViewModel.prototype.editEnabled editEnabled
     * @parent sectionTitle.ViewModel
     *
     * Whether the component's edit options are enabled or not.
     */
    editEnabled: {
      value: false
    },

    /**
     * @property {Boolean} sectionTitle.ViewModel.prototype.editActive editActive
     * @parent sectionTitle.ViewModel
     *
     * Whether the component is currently selected.
     */
    editActive: {
      value: false
    },

    /**
     * @property {String} sectionTitle.ViewModel.prototype.sectionCounter sectionCounter
     * @parent sectionTitle.ViewModel
     *
     * The style used for the (optional) counter associated with the title, if
     * set to 'none' there will be no counter; supported options are 'upp-alpha',
     * 'upper-roman' and 'decimal'.
     */
    sectionCounter: {
      value: 'none'
    },
  }
});

export default Component.extend({
  template,
  tag: 'a2j-section-title',
  viewModel: SectionTitleVM,

  events: {
    '.title-input keyup': function($el) {
      this.viewModel.attr('title', $el.val());
    }
  }
});

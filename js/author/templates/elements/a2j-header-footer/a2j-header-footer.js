import $ from 'jquery';
import Component from 'can/component/';
import Map from 'can/map/';
import template from './a2j-header-footer.stache!';

/**
 * @property {can.Map} headerFooter.ViewModel
 * @parent headerFooter
 *
 * `<a2j-header-footer>`'s viewModel.
 */
export let HeaderFooterVM = Map.extend({
  define: {
    /**
     * @property {String} headerFooter.ViewModel.prototype.title title
     * @parent headerFooter.ViewModel
     *
     * Title
     */
    title: {
      type: 'string'
    },

    /**
     * @property {Boolean} headerFooter.ViewModel.prototype.notDisplayedOnFirstPage notDisplayedOnFirstPage
     * @parent headerFooter.ViewModel
     *
     * Whether the Header/Footer should not be displayed on the first page
     * of the assembled PDF
     */
    notDisplayedOnFirstPage: {
      value: false
    },

    /**
     * @property {String} headerFooter.ViewModel.prototype.userContent userContent
     * @parent headerFooter.ViewModel
     *
     * Content of Custom Header/Footer input by user
     */
    userContent: {
      type: 'string'
    },

    /**
     * @property {Boolean} headerFooter.ViewModel.prototype.containsWords containsWords
     * @parent headerFooter.ViewModel
     *
     * Whether the userContent contains words and not just stray html
     *
     * This is done by creating a jquery element with the userContent and
     * using jQuery.text() on the element.
     */
    containsWords: {
      type: 'boolean',
      get() {
        return !!$(this.attr('userContent')).text();
      }
    },

    /**
     * @property {Boolean} headerFooter.ViewModel.prototype.editEnabled editEnabled
     * @parent headerFooter.ViewModel
     *
     * Allow the user to edit the <a2j-rich-text> content
     */
    editEnabled: {
      value: true
    },

    /**
     * @property {Boolean} headerFooter.ViewModel.prototype.editActive editActive
     * @parent headerFooter.ViewModel
     *
     * Whether the user is editing the Header/Footer content
     *
     * This is also passed to the <a2j-rich-text> element so that if the
     * Header/Footer is being edited, the rich-text content will be editable.
     */
    editActive: {
      value: false
    },

    /**
     * @property {Boolean} headerFooter.ViewModel.prototype.showOptionsPane showOptionsPane
     * @parent headerFooter.ViewModel
     *
     * Hide the <element-options-pane> in the <a2j-rich-text> element
     * to prevent user from seeing Drag/Drop, Duplicate, and Delete buttons
     */
    showOptionsPane: {
      value: false
    },

    /**
     * @property {Boolean} headerFooter.ViewModel.prototype.wrapWithContainer wrapWithContainer
     * @parent headerFooter.ViewModel
     *
     * Hide the <element-container> in the <a2j-rich-text> element
     * to prevent the user from seeing the container styling.
     */
    wrapWithContainer: {
      value: false
    }
  },


  /**
   * @property {Function} headerFooter.ViewModel.prototype.setEditActive setEditActive
   * @parent headerFooter.ViewModel
   *
   * Change the editActive property
   *
   * ## Use
   *
   * @codestart
   * <button ($click)="setEditActive(false)" type="button">Close</button>
   * @codeend
   */
  setEditActive(val) {
    this.attr('editActive', val);
  }
});

/**
 * @module {Module} author/templates/list/header-footer/ <a2j-header-footer>
 * @parent api-components
 *
 * This component represents a Custom Header or Footer element for the templates list
 *
 * ## Use
 *
 * @codestart
 *   <a2j-header-footer>
 *   </a2j-header-footer>
 * @codeend
 */
export default Component.extend({
  template,
  tag: 'a2j-header-footer',

  viewModel(attrs) {
    return new HeaderFooterVM(attrs.state);
  },

  events: {
    inserted() {
      this.viewModel.attr('title', this.element.attr('title'));
    }
  }
});

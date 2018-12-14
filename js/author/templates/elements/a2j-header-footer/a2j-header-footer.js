import $ from 'jquery'
import Component from 'can-component'
import CanMap from 'can-map'
import template from './a2j-header-footer.stache'

/**
 * @property {can.Map} headerFooter.ViewModel
 * @parent headerFooter
 *
 * `<a2j-header-footer>`'s viewModel.
 */
export let HeaderFooterVM = CanMap.extend('HeaderFooterVM', {
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
     * @property {String} headerFooter.ViewModel.prototype.fontProperties fontProperties
     * @parent headerFooter.ViewModel
     *
     * Font CSS rules to be applied to the content of each element of this
     * page's a2j-template (these should be taken directly from that template)
     */
     fontProperties: {},

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
      get () {
        return !!$(this.attr('userContent')).text()
      }
    },

    /**
     * @property {Boolean} headerFooter.ViewModel.prototype.editActive editActive
     * @parent headerFooter.ViewModel
     *
     * Whether the user is editing the Header/Footer content (at all)
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
  setEditActive (val) {
    this.attr('editActive', val)

    if (!val) {
      let save = this.attr('saveTemplate')
      save()
    }
  },

  /**
   * @property {Function} headerFooter.ViewModel.prototype.setUserContent setUserContent
   * @parent headerFooter.ViewModel
   *
   * Set the userContent property, out-of-band (it's usually set when
   * `editActive' changes). This is useful e.g. if your element is removed from
   * the DOM before its bindings can propagate. See a2j-header-footer's view for
   * an example of this
   */
  setUserContent (val) {
    this.attr('userContent', val)
  }
})

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
  view: template,
  tag: 'a2j-header-footer',
  ViewModel: HeaderFooterVM,

  events: {
    inserted () {
      this.viewModel.attr('title', $(this.element).attr('title'))
    }
  },

  leakScope: true
})

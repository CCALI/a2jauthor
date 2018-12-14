import CanMap from 'can-map'
import Component from 'can-component'
import contentTpl from './content.stache'
import template from './a2j-section-title.stache'
import stache from 'can-stache'

// preload stache partial
stache.registerPartial('section-title-content', contentTpl)

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
export let SectionTitleVM = CanMap.extend('SectionTitleVM', {
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
     * @property {Boolean} sectionTitle.ViewModel.prototype.deleted deleted
     * @parent sectionTitle.ViewModel
     *
     * Whether the component is currently deleted.
     */
    deleted: {
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

    /**
     * @property {String} sectionTitle.ViewModel.prototype.titleTag titleTag
     * @parent sectionTitle.ViewModel
     *
     * Control the size of the title shown at the top of the component's content.
     */
    titleTag: {
      value: 'h3'
    },

    /**
     * @property {String} sectionTitle.ViewModel.prototype.title title
     * @parent sectionTitle.ViewModel
     *
     * The title of the section.
     */
    title: {
      value: ''
    },

    /**
     * @property {String} sectionTitle.ViewModel.prototype.underline underline
     * @parent sectionTitle.ViewModel
     *
     * Control if the title is underlined or not
     */
    underline: {
      type: 'boolean',
      value: false
    }
  },
  // Prevent the form from being submitted when pressing enter
  // when inside an input
  preventSubmit (e) {
    e.preventDefault()
  }
})

export default Component.extend({
  view: template,
  tag: 'a2j-section-title',
  ViewModel: SectionTitleVM,

  events: {
    '.title-input keyup': function (el) {
      this.viewModel.attr('title', el.value)
    }
  },

  helpers: {
    showSectionTitle () {
      let title = this.attr('title')
      let tag = this.attr('titleTag')
      let sectionCounter = this.attr('sectionCounter')

      return `<${tag} class="section-title count-${sectionCounter}">${title}</${tag}>`
    }
  },

  leakScope: true
})

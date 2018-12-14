import CanMap from 'can-map'
import loader from '@loader'
import stache from 'can-stache'
import Component from 'can-component'
import contentTpl from './content.stache'
import template from './a2j-rich-text.stache'

import 'can-map-define'

stache.registerPartial('rich-text-content', contentTpl)

/*
 * @module RichTextVM
 * @parent A2JRichText
 *
 * <a2j-rich-text /> viewmodel
 */
export let RichTextVM = CanMap.extend('RichTextVM', {
  define: {
    /**
     * @property {String} notes
     *
     * The notes added by the author using the element options panel
     */
    notes: {
      value: ''
    },

    userContent: {
      value: ''
    },

   /**
    * @property {Function} richText.ViewModel.prototype.setUserContent setUserContent
    * @parent richText.ViewModel
    *
    * Set the userContent property, out-of-band (it's usually set when
    * `editActive' changes). This is useful e.g. if your element is removed from
    * the DOM before its bindings can propagate. See a2j-header-footer's view
    * for an example of this
    */
    setUserContent: {
      type: 'any'
    },

    /**
     * @property {Boolean} richText.ViewModel.prototype.editEnabled editEnabled
     * @parent richText.ViewModel
     *
     * Whether the component's edit options are enabled or not.
     */
    editEnabled: {
      value: false
    },

    /**
     * @property {Boolean} richText.ViewModel.prototype.editActive editActive
     * @parent richText.ViewModel
     *
     * Whether the component is currently selected.
     */
    editActive: {
      value: false
    },

    /**
     * @property {Boolean} richText.ViewModel.prototype.deleted deleted
     * @parent richText.ViewModel
     *
     * Whether the component is currently deleted.
     */
    deleted: {
      value: false
    },

    ckeditorInstance: {
      type: '*'
    },

    showOptionsPane: {
      value: true
    },

    wrapWithContainer: {
      value: true
    },

    nodeId: {}
  },

  updateUserContent () {
    let instance = this.attr('ckeditorInstance')

    if (instance) {
      let data = instance.getData()

      this.attr('userContent', data)
      // see the view model for why we're doing this twice
      let setUserContent = this.attr('setUserContent')
      if (typeof setUserContent === 'function') {
        setUserContent(data)
      }
    }
  },

  destroyEditorInstance () {
    let instance = this.attr('ckeditorInstance')

    if (instance) {
      instance.destroy()
      instance.removeAllListeners()
      this.attr('ckeditorInstance', null)
    }
  }
})

/**
 * @module A2JRichText
 * @parent api-components
 *
 * The Rich Text template element
 */
export default Component.extend({
  view: template,
  tag: 'a2j-rich-text',
  ViewModel: RichTextVM,

  helpers: {
    a2jParse (templateSnippet) {
      return stache(templateSnippet)({
        answers: this.attr('answers'),
        useAnswers: this.attr('useAnswers'),
        legalNavResources: this.attr('legalNavResources')
      })
    }
  },

  events: {
    inserted () {
      let vm = this.viewModel
      let editActive = vm.attr('editActive')
      let editEnabled = vm.attr('editEnabled')

      if (editEnabled) {
        loader.import('caja/ckeditor/').then(() => {
          if (editActive) this.initCKEditor()
        })
      }
    },

    '{element} beforeremove' () {
      let vm = this.viewModel
      vm.updateUserContent()
      vm.destroyEditorInstance()
    },

    '{viewModel} editActive': function () {
      let vm = this.viewModel
      let editActive = vm.attr('editActive')

      if (editActive) {
        this.initCKEditor()
      } else {
        vm.updateUserContent()
        vm.destroyEditorInstance()
      }
    },

    initCKEditor () {
      let vm = this.viewModel
      let $el = $(this.element)
      // wait for the template to be updated, otherwise the `textarea`
      // won't be in the DOM when `ckeditor.replace` is called.
      setTimeout(() => {
        // check if we have access to the element while dragging is going on
        if ($el) {
          let $textarea = $el.find('textarea')

          let editor = window.CKEDITOR.replace($textarea.get(0), {
            extraPlugins: 'a2j-variable,a2j-guid',
            extraAllowedContent: {
              'a2j-variable': {
                attributes: ['name']
              },
              'legal-nav-resource-id': {
                attributes: ['name', 'guid']
              }
            }
          })

          vm.attr('ckeditorInstance', editor)
        }
      })
    }
  },

  leakScope: true
})

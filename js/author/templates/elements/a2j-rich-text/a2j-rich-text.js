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
export let RichTextVM = CanMap.extend({
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

    editEnabled: {
      value: false
    },

    editActive: {
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
    }
  },

  updateUserContent () {
    let instance = this.attr('ckeditorInstance')

    if (instance) {
      this.attr('userContent', instance.getData())
    }
  },

  destroyEditorInstance () {
    let instance = this.attr('ckeditorInstance')

    if (instance) {
      instance.destroy()
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
        useAnswers: this.attr('useAnswers')
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
            extraPlugins: 'a2j-variable',
            extraAllowedContent: {
              'a2j-variable': {
                attributes: ['name']
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

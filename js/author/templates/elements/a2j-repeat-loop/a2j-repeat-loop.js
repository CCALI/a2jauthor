import loader from '@loader'
import stache from 'can-stache'
import Component from 'can-component'
import _isNumber from 'lodash/isNumber'
import RepeatLoopVM from './a2j-repeat-loop-vm'
import template from './a2j-repeat-loop.stache'
import loopListTpl from './loop-views/loop-list.stache'
import loopTableTpl from './loop-views/loop-table.stache'
import repeatLoopOptionsTpl from './repeat-loop-options.stache'

stache.registerPartial('loop-list-tpl', loopListTpl)
stache.registerPartial('loop-table-tpl', loopTableTpl)
stache.registerPartial('repeat-loop-options-tpl', repeatLoopOptionsTpl)

const displayTypeMap = {
  list: 'A LIST',
  table: 'A TABLE',
  text: 'PARAGRAPH'
}

/**
 * @module {Module} author/templates/elements/a2j-repeat-loop/ <a2j-repeat-loop>
 * @parent api-components
 *
 * This component allows the loop over `repeating` variables and create tables/
 * lists with those values.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-repeat-loop {state}="state" />
 * @codeend
 */
export default Component.extend({
  view: template,
  tag: 'a2j-repeat-loop',
  ViewModel: RepeatLoopVM,

  events: {
    inserted () {
      let vm = this.viewModel
      let editActive = vm.attr('editActive')
      let editEnabled = vm.attr('editEnabled')
      let displayType = vm.attr('displayType')

      if (editEnabled) {
        loader.import('caja/ckeditor/').then(() => {
          if (displayType === 'text' && editActive) {
            this.initCKEditor()
          }
        })
      }
    },

    '{viewModel} displayType': function () {
      let vm = this.viewModel
      let editActive = vm.attr('editActive')
      let displayType = vm.attr('displayType')

      if (displayType === 'text' && editActive) {
        this.initCKEditor()
      } else {
        vm.updateLoopRichText()
        vm.destroyEditorInstance()
      }
    },

    '{viewModel} editActive': function () {
      let vm = this.viewModel
      let editActive = vm.attr('editActive')
      let displayType = vm.attr('displayType')

      if (displayType === 'text' && editActive) {
        this.initCKEditor()
      } else {
        vm.updateLoopRichText()
        vm.destroyEditorInstance()
      }
    },

    '.input-loop-title keyup': function (el) {
      this.viewModel.attr('loopTitle', el.value)
    },

    'input[name="displayType"] change': function (el) {
      this.viewModel.attr('displayType', el.value)
    },

    'input[name="tableStyle"] change': function (el) {
      this.viewModel.attr('tableStyle', el.value)
    },

    'input[name="repeatEachInOneList"] change': function (el) {
      this.viewModel.attr('repeatEachInOneList', el.value === 'true')
    },

    initCKEditor () {
      let vm = this.viewModel
      let $el = $(this.element)

      // wait for the template to be updated, otherwise the `textarea`
      // won't be in the DOM when `ckeditor.replace` is called.
      setTimeout(() => {
        let $textarea = $el.find('textarea')

        // check if we have access to the element while dragging is going on
        if ($textarea.get(0)) {

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

  helpers: {
    a2jParse (templateSnippet, index) {
      let scope = {
        answers: this.attr('answers'),
        useAnswers: this.attr('useAnswers')
      }

      if (_isNumber(index)) {
        scope.varIndex = index
      }

      return stache(templateSnippet)(scope)
    },

    showRemoveButton (index, options) {
      return (index > 0)
    },

    displayTypeText () {
      let type = this.attr('displayType')
      return displayTypeMap[type]
    },

    showRepeatLoopTitle () {
      let title = this.attr('loopTitle')
      let tag = this.attr('loopTitleTag')

      return `<${tag}>${title}</${tag}>`
    }
  },

  leakScope: true
})

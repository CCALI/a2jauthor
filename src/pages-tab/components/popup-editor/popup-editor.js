import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './popup-editor.stache'
import { ckeFactory } from '../../helpers/helpers'

export const PopupEditorVM = DefineMap.extend('PopupEditorVM', {
  page: {},
  appState: {},
  guideFiles: {},

  ckeFactory,

  name: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (newname) {
        newname = newname.trim()
        // this.page.name = newname
        if (window.pageRename(this.page, newname)) {
          resolve(newname)
          window.updateTOC()
        }
      })
      resolve(this.page.name || '')
    }
  },

  helpAltTextChangeHandler: function (el) {
    const val = el.value
      .replace(/[^\w\s]|_/g, '') // only allow letters, digits, and whitespace
      .replace(/\s+/g, ' ') // single spaces only
      .trim().substring(0, 120)
    this.page.helpAltText = val
    el.value = val
    return val
  }
})

export default Component.extend({
  tag: 'popup-editor',
  view: template,
  leakScope: false,
  ViewModel: PopupEditorVM
})

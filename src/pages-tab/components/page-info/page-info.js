import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './page-info.stache'
import { ckeFactory } from '../../helpers/helpers'

export const PageInfoVM = DefineMap.extend('PageInfoVM', {
  page: {},
  appState: {},

  get steps () {
    const guide = this.appState && this.appState.guide
    const steps = guide && guide.steps
    return steps
  },

  step: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        // page.step is the index of steps, it is not always equal to step.number CCALI/a2jauthor#342
        this.page.step = parseInt(val, 10)
        resolve(val)
        window.updateTOC()
      })
      resolve(this.page.step + '')
    }
  },

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

  get ckePageNotesArea () {
    return ckeFactory(this.page, 'notes', 'Notes:')
  },

  get legacySection () {
    return window.buildPageFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'page-info',
  view: template,
  leakScope: false,
  ViewModel: PageInfoVM
})

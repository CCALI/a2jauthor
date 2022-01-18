import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './pages-tab.stache'
import { PageEditFormVM } from './components/page-edit-form/page-edit-form.js'
import pageEditForm from './components/page-edit-form/page-edit-form.stache'

export const PagesTabVM = DefineMap.extend('PagesTabVM', {
  // passed in via app.stache
  guide: {},
  guideId: {},
  appState: {},

  expanded: {
    type: 'boolean',
    default: true
  },

  getSelectedPageName () {
    return window.getSelectedPageName()
  },
  legacyGotoPageEdit: {},
  goToPageEdit () {
    const pageName = this.getSelectedPageName()
    const page = pageName && window.gGuide.pages[pageName]

    page && (window.canjs_LegacyModalPageEditFormInjection = {
      appState: this.appState,
      page: page
    })

    const retval = window.gotoPageEdit(pageName)

    delete window.canjs_LegacyModalPageEditFormInjection

    return retval
  },
  pageEditClone () {
    return window.pageEditClone(this.getSelectedPageName())
  },
  pageEditDelete () {
    return window.pageEditDelete(this.getSelectedPageName())
  },
  guideSave () {
    return window.gGuide && window.guideSave()
  },
  createNewPage () {
    return window.createNewPage()
  },
  createNewPopup () {
    return window.createNewPopup()
  },

  expandCollapsePageList () {
    if (this.expanded) {
      this.expanded = false
      window.$('#CAJAOutline .panel-collapse').slideUp(300)
    } else {
      this.expanded = true
      window.$('#CAJAOutline .panel-collapse').slideDown(300)
    }
  }
})

export default Component.extend({
  tag: 'pages-tab',
  view: template,
  leakScope: false,
  ViewModel: PagesTabVM,
  events: {
    '.pages-container a.page-item dblclick': function (legacyEl) {
      // const pageName = console.log((legacyEl.rel || '').substr(5))
      setTimeout(() => this.viewModel.goToPageEdit(), 10)
    }
  }
})

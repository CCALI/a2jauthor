import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './pages-tab.stache'
// need these imported for the legacy injection to work (and for them to be bundled)
import { PageEditFormVM } from './components/page-edit-form/page-edit-form.js' // eslint-disable-line
import pageEditForm from './components/page-edit-form/page-edit-form.stache' // eslint-disable-line

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
  goToPageEdit (pageName) {
    pageName = pageName || this.getSelectedPageName()
    const page = pageName && window.gGuide.pages[pageName]

    page && (window.canjs_LegacyModalPageEditFormInjection = {
      appState: this.appState,
      page,
      goToPageEdit: this.goToPageEdit.bind(this)
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
  },

  connectedCallback () {
    this.guide && setTimeout(window.updateTOC, 10)
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

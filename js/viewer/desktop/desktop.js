import CanMap from 'can-map'
import Component from 'can-component'
import template from './desktop.stache'
import _isUndefined from 'lodash/isUndefined'

import 'can-map-define'

let DesktopViewerVM = CanMap.extend('DesktopViewerVM', {
  define: {
    currentPage: {
      get () {
        return this.attr('rState.currentPage')
      }
    },

    visitedPages: {},

    selectedPageIndex: {},

    remainingSteps: {},

    maxDisplayedSteps: {},

    interview: {},

    traceLogic: {
      value: []
    },

    pageNotFound: {
      value: false
    },

    modalContent: {
      value: null
    },

    showDemoNotice: {
      value: false
    },

    authorBrandLogo: {
      get () {
        return this.attr('interview.logoImage')
      }
    },

    authorCourthouseImage: {
      get () {
        return this.attr('interview.endImage')
      }
    }
  },

  init () {
    let routeState = this.attr('rState')

    if (routeState && routeState.view === 'intro') {
      const interview = this.attr('interview')
      routeState.view = 'pages'
      if (routeState.page !== interview.attr('firstPage')) {
        routeState.page = interview.attr('firstPage')
      }
    }

    this.checkPageExists()
  },

  checkPageExists () {
    const routeState = this.attr('rState')
    const interview = this.attr('interview')

    if (!routeState || !interview) return

    const pageName = routeState.page

    if (routeState.view === 'pages') {
      const page = interview.attr('pages').find(pageName)
      this.attr('pageNotFound', _isUndefined(page))
    }
  }
})

export default Component.extend({
  view: template,
  tag: 'a2j-desktop-viewer',
  ViewModel: DesktopViewerVM,

  helpers: {
    eval (str) {
      str = typeof str === 'function' ? str() : str
      return this.attr('logic').eval(str)
    }
  },

  events: {
    inserted () {
      let vm = this.viewModel
      let location = window.location.toString()
      vm.attr('showDemoNotice', location.indexOf('.a2jauthor.org') !== -1)
    },

    '{rState} page': function () {
      this.viewModel.checkPageExists()
    }
  },

  leakScope: true
})

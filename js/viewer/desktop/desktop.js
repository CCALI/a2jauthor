import CanMap from 'can-map'
import Component from 'can-component'
import template from './desktop.stache'
import _isUndefined from 'lodash/isUndefined'

import 'can-map-define'

let DesktopViewerVM = CanMap.extend({
  define: {
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

    if (routeState) {
      let view = routeState.attr('view')
      let interview = this.attr('interview')

      if (view === 'intro') {
        routeState.attr({
          view: 'pages',
          page: interview.attr('firstPage')
        })
      }

      this.checkPageExists()
    }
  },

  checkPageExists () {
    let routeState = this.attr('rState')
    let interview = this.attr('interview')

    if (!routeState || !interview) return

    let view = routeState.attr('view')
    let pageName = routeState.attr('page')

    if (view === 'pages') {
      let page = interview.attr('pages').find(pageName)
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

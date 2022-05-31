import CanMap from 'can-map'
import Component from 'can-component'
import template from './toolbar.stache'

import route from 'can-route'
import 'can-map-define'
import 'bootstrap/js/modal'

import { sharedPdfFlag } from '../../../pdf/index'

export const Toolbar = CanMap.extend({
  define: {
    filter: {
      type: 'string'
    },

    searchToken: {
      type: 'string',
      value: ''
    },

    showClearButton: {
      get () {
        return this.attr('searchToken').length
      }
    }
  },

  setFilter (filter) {
    this.attr('filter', filter)
  },

  clearSearchToken () {
    this.attr('searchToken', '')
  },

  openNewTemplate (flag) {
    sharedPdfFlag.set(flag)

    route.data.page = 'templates'
    route.data.templateId = 'new'
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: Toolbar,
  tag: 'templates-toolbar',
  events: {
    '.search-input keyup': function (target) {
      const newToken = target.val().trim()
      this.viewModel.attr('searchToken', newToken)
    }
  }
})

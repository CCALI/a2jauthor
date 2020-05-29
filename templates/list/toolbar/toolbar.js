import CanMap from 'can-map'
import Component from 'can-component'
import template from './toolbar.stache'

import route from 'can-route'
import 'can-map-define'
import 'bootstrap/js/modal'

import { sharedPdfFlag } from '@caliorg/a2jdeps/pdf/index'

export let Toolbar = CanMap.extend({
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

    route.data.attr('page', 'templates')
    route.data.attr('templateId', 'new')
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: Toolbar,
  tag: 'templates-toolbar',
  events: {
    '.search-input keyup': function (target) {
      let newToken = target.val().trim()
      this.viewModel.attr('searchToken', newToken)
    }
  }
})

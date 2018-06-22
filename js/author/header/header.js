import CanMap from "can-map"
import Component from "can-component"
import template from './header.stache'
import helpPageUrl from 'caja/author/utils/help-page-url'

import "can-map-define"

export let HeaderVM = CanMap.extend({
  define: {
    helpPageUrl: {
      get () {
        let page = this.attr('page')
        return helpPageUrl(page)
      }
    }
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'app-header',
  viewModel: HeaderVM
})

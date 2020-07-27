import CanMap from 'can-map'
import Component from 'can-component'
import template from './header.stache'
import helpPageUrl from 'a2jauthor/utils/help-page-url'

import 'can-map-define'

export let HeaderVM = CanMap.extend({
  define: {
    /**
     * @property {String} alert.ViewModel.prototype.define.title title
     * @parent header.ViewModel
     *
     * title of currently loaded Guided Interview
     */
    title: {},

    /**
     * @property {String} alert.ViewModel.prototype.define.helpPageUrl helpPageUrl
     * @parent header.ViewModel
     *
     * helpPageUrl string, if it exists
     */
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
  ViewModel: HeaderVM
})

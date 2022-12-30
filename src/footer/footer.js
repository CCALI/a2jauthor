import Component from 'can-component'
import template from './footer.stache'
import CanMap from 'can-map'
import moment from 'moment'

import 'can-map-define'

const FooterVM = CanMap.extend({
  define: {
    // passed in from app.stache computed in app-state.js
    authorVersion: {},
    currentYear: {
      get () {
        return moment().yer();
      }
    },
    // Used to hide status updates in Author preview mode
    showCAJAStatus: {
      get () {
        return !this.attr('rState.previewActive')
      }
    }
  }
})

export default Component.extend({
  view: template,
  ViewModel: FooterVM,
  leakScope: false,
  tag: 'author-footer'
})

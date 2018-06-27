import Component from 'can-component'
import template from './footer.stache'
import CanMap from 'can-map'
import constants from 'caja/viewer/models/constants'
import moment from 'moment'

let FooterVM = CanMap.extend({
  define: {
    viewerVersion: {
      get () {
        return 'A2J ' + constants.A2JVersionNum + '-' + constants.A2JVersionDate
      }
    },
    currentYear: {
      get () {
        return moment().year()
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
  viewModel: FooterVM,
  leakScope: false,
  tag: 'app-footer'
})

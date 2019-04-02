import CanMap from 'can-map'
import Component from 'can-component'
import template from './intro.stache'

import 'can-map-define'

const IntroVM = CanMap.extend('IntroVM', {
  define: {
    // passed in via mobile.stache
    rState: {},
    mState: {},
    pState: {},
    interview: {}
  },
  navigate () {
    this.attr('rState').page = this.attr('interview.firstPage')
    this.attr('rState').view = 'pages'
  }
})

export default Component.extend({
  view: template,
  tag: 'a2j-intro',
  ViewModel: IntroVM,

  events: {
    inserted () {
      this.viewModel.attr('mState.header', '')
      this.viewModel.attr('mState.step', '')
    }
  },

  leakScope: true
})

import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './about.stache'
import proxyGuideChanges from '~/src/utils/proxy-guide-changes'

export const AboutVM = DefineMap.extend('AboutVM', {
  // passed in via app.stache
  guide: {},
  guideId: {},

  mirrorProperties: {
    get () {
      return [
        'avatarSkinTone', // main
        'completionTime',
        'credits',
        'description',
        'guideGender',
        'jurisdiction',
        'language',
        'title',
        'logoImage', // layout
        'endImage',
        'sendfeedback', // feedback
        'emailContact'
      ]
    }
  },

  connectedCallback () {
    // TODO: Remove this when gGuide is.
    // We need this proxy util to update the global gGuide as we make changes.
    const proxyTeardown = proxyGuideChanges(this.guide, this.mirrorProperties)

    return function () {
      proxyTeardown()
    }
  }
})

export default Component.extend({
  tag: 'about-tab',
  view: template,
  leakScope: false,
  ViewModel: AboutVM
})

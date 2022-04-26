import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './about.stache'
import proxyGuideChanges from '~/src/utils/proxy-guide-changes'

export const AboutVM = DefineMap.extend('AboutVM', {
  // passed in via app.stache
  guide: {},
  guideId: {},
  gPrefs: {},

  showSettingsModal: { default: false },

  mirrorProperties: {
    get () {
      return [
        'avatarSkinTone', // main
        'avatarHairColor',
        'guideGender',
        'completionTime',
        'title',
        'description',
        'jurisdiction',
        'credits',
        'language',
        'logoImage', // layout
        'endImage',
        'useMobileUI',
        'showNavDefault',
        'sendfeedback', // feedback
        'emailContact',
        'version', // revision history
        'publishedVersion',
        'notes'
        // 'authors' are proxied/saved in authors.js
      ]
    }
  },

  openSettingsModal () {
    this.showSettingsModal = true
  },

  onSaveSettings () {
    this.gPrefs.save()
    this.showSettingsModal = false
  },

  onDismissSettings () {
    this.showSettingsModal = false
  },

  cleanupRevisionNotes (html) {
    return $('<div>' + html + '</div>').text()
  },

  connectedCallback () {
    // copied from a2j_tabs legacy code to handle tab changes
    // TODO: refactor to CanJS tab component/widget
    $('#about-tabs > li').removeClass('active')
    $('.tab-pane').removeClass('active')

    $('#about-tabs > li').first().addClass('active')
    $('#tab-about').addClass('active')

    $('#about-tabs > li > a').click(function (event) {
      $('#about-tabs > li').removeClass('active')
      $(this).parent().addClass('active')

      $('.tab-pane').removeClass('active')
      const panelId = $(this).data('panel')
      $('#' + panelId).addClass('active')
    })

    // cleanup old revision notes that could have ckeditor html tags
    if (this.guide) {
      this.guide.notes = this.cleanupRevisionNotes(this.guide.notes)
    }

    // TODO: Remove this when gGuide is.
    // We need this proxy util to update the global gGuide as we make changes.
    const proxyTeardown = proxyGuideChanges(this.guide, this.mirrorProperties)

    return function () {
      // save any final guide changes before teardown
      window.guideSave()
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

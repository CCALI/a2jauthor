import CanMap from 'can-map'
import Component from 'can-component'
import template from './main.stache'

function getLanguageList () {
  const langs = window.Languages.regional
  const locales = Object.keys(langs)
  return locales.map(code => {
    const {
      locale,
      Language: name,
      LanguageEN: englishName
    } = langs[code]
    return { locale, name, englishName }
  })
}

export const AboutMainVm = CanMap.extend({
  define: {
    guide: {},
    languageOptions: {
      get () {
        return getLanguageList().map(language => ({
          value: language.locale,
          displayName: `${language.name} (${language.englishName}) {${language.locale}}`
        }))
      }
    }
  },

  updateLanguagePack () {
    const language = this.attr('guide.language')
    window.Languages.set(language)
  },

  updateAvatarGender (event) {
    const { checked, value } = event.target
    const gender = checked && value.toLowerCase() === 'male' ? 'male' : 'female'
    this.attr('guide.guideGender', gender)
  },

  updateSkinTone (skinTone) {
    this.attr('guide.avatarSkinTone', skinTone)
  },

  updateHairColor (hairColor) {
    this.attr('guide.avatarHairColor', hairColor)
  },

  connectedCallback (el) {
    // TODO: Remove this when gGuide is.
    // We need this proxy to update the global gGuide as we make changes.
    const vm = this
    const mirrorProperties = [
      'avatarHairColor',
      'avatarSkinTone',
      'completionTime',
      'credits',
      'description',
      'guideGender',
      'jurisdiction',
      'language',
      'title'
    ]

    const handler = (ev, newVal, oldVal) => {
      const guideAttr = ev.type
      window.gGuide[guideAttr] = newVal
    }

    mirrorProperties.forEach((prop) => {
      // using the notify queue updates global gGuide instantly
      vm.attr('guide').listenTo(prop, handler, 'notify')
    })

    return function () {
      mirrorProperties.forEach((prop) => {
        vm.attr('guide').stopListening(prop, handler, 'notify')
      })
    }
  }
})

export default Component.extend({
  tag: 'about-main',
  view: template,
  leakScope: false,
  ViewModel: AboutMainVm
})

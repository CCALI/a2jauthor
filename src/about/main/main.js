import CanMap from 'can-map'
import Component from 'can-component'
import template from './main.stache'

import 'can-map-define'

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
  }
})

export default Component.extend({
  tag: 'about-main',
  view: template,
  leakScope: false,
  ViewModel: AboutMainVm
})

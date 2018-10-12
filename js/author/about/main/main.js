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
    return {locale, name, englishName}
  })
}

// TODO: Remove this when gGuide is.
// We need this proxy to update the gGuide as we make changes.
function proxyGuideInfo (viewModel) {
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

  function onChange (event, attr) {
    const rootKey = '%root.'
    if (attr.indexOf(rootKey) === 0) {
      attr = attr.slice(rootKey.length)
    }

    const guideKey = 'guide.'
    const isGuideAttr = attr.indexOf(guideKey) === 0
    if (!isGuideAttr) {
      return
    }

    const guideAttr = attr.slice(guideKey.length)
    if (mirrorProperties.indexOf(guideAttr) !== -1) {
      window.gGuide[guideAttr] = viewModel.attr(attr)
    }
  }

  viewModel.bind('change', onChange)
  return function () {
    viewModel.unbind('change', onChange)
  }
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
    const {checked, value} = event.target
    const gender = checked && value.toLowerCase() === 'male' ? 'male' : 'female'
    this.attr('guide.guideGender', gender)
  },

  updateSkinTone (skinTone) {
    console.log('updating skin color')
    this.attr('guide.avatarSkinTone', skinTone)
  },

  updateHairColor (hairColor) {
    console.log('updating hair color')
    this.attr('guide.avatarHairColor', hairColor)
  }
})

export default Component.extend({
  tag: 'about-main',
  view: template,
  leakScope: false,
  ViewModel: AboutMainVm,
  events: {
    inserted () {
      if (this.cancelProxy) {
        return
      }
      this.cancelProxy = proxyGuideInfo(this.viewModel)
    },
    '{element} beforeremove' () {
      if (this.cancelProxy) {
        this.cancelProxy()
        this.cancelProxy = undefined
      }
    }
  }
})

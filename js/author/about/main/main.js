import Map from 'can/map/';
import Component from 'can/component/';
import template from './main.stache';

function getLanguageList () {
  const langs = window.Languages.regional;
  const locales = Object.keys(langs);
  return locales.map(code => {
    const {
      locale,
      Language: name,
      LanguageEN: englishName
    } = langs[code];
    return {locale, name, englishName};
  });
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
  ];

  function onChange (event, attr) {
    const rootKey = '%root.';
    if (attr.indexOf(rootKey) === 0) {
      attr = attr.slice(rootKey.length);
    }

    const guideKey = 'guide.';
    const isGuideAttr = attr.indexOf(guideKey) === 0;
    if (!isGuideAttr) {
      return;
    }

    const guideAttr = attr.slice(guideKey.length);
    if (mirrorProperties.indexOf(guideAttr) !== -1) {
      window.gGuide[guideAttr] = viewModel.attr(attr);
    }
  }

  viewModel.bind('change', onChange);
  return function () {
    viewModel.unbind('change', onChange);
  };
}

export const AboutMainVm = Map.extend({
  define: {
    languageOptions: {
      get () {
        return getLanguageList().map(language => ({
          value: language.locale,
          displayName: `${language.englishName} (${language.name}) {${language.locale}}`
        }));
      }
    }
  },

  updateDescription (description) {
    this.attr('guide.description', description);
  },

  updateLanguagePack () {
    const language = this.attr('guide.language');
    window.Languages.set(language);
  },

  updateAvatarGender (event) {
    const {checked, value} = event.target;
    const gender = checked && value.toLowerCase() === 'male' ? 'male' : 'female';
    this.attr('guide.guideGender', gender);
  },

  updateSkinTone (skinTone) {
    this.attr('guide.avatarSkinTone', skinTone);
  },

  updateHairColor (hairColor) {
    this.attr('guide.avatarHairColor', hairColor);
  },

  updateCredits (credits) {
    this.attr('guide.credits', credits);
  }
});

export default Component.extend({
  tag: 'about-main',
  template,
  leakScope: false,
  viewModel: AboutMainVm,
  events: {
    inserted () {
      if (this.cancelProxy) {
        return;
      }
      this.cancelProxy = proxyGuideInfo(this.viewModel);
    },
    removed () {
      if (this.cancelProxy) {
        this.cancelProxy();
        this.cancelProxy = undefined;
      }
    }
  }
});

import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './page-edit-form.stache'
import GuideFiles from '~/src/models/guide-files'
import constants from 'a2jauthor/src/models/constants'

export const PageEditFormVM = DefineMap.extend('PageEditFormVM', {
  appState: {},
  page: {},
  goToPageEdit: {},

  get isPopup () {
    const page = this.page || {}
    return page.type === constants.ptPopup
  },

  selectedTab: { default: 'Page Info' },

  toggleTabs () {
    this.appState.modalTabView = !this.appState.modalTabView
  },

  guideFiles: {
    value (props) {
      const { resolve } = props

      props.lastResolved = props.lastResolved || new DefineMap({ media: [], templates: [], xml: [] })
      const gid = this.appState.guideId
      if (gid && gid !== 'a2j') {
        GuideFiles.findAll(gid).then(gf => {
          if (gf && gf.media.length) {
            props.lastResolved.media.length = 0
            props.lastResolved.media.push(...gf.media)
          }
          if (gf && gf.templates.length) {
            props.lastResolved.templates.length = 0
            props.lastResolved.templates.push(...gf.templates)
          }
          if (gf && gf.xml.length) {
            props.lastResolved.xml.length = 0
            props.lastResolved.xml.push(...gf.xml)
          }
          resolve(props.lastResolved)
        })
        return () => {} // required
      }
      // listenTo(lastSet, v => resolve(prop.lastResolved))
      resolve(props.lastResolved)
    }
  },

  connectedCallback () {
    // TOOD: obviously terrible, need more time to complete the upgrade fully
    // sets "appState" and "page" on our viewModel
    Object.assign(this, window.canjs_LegacyModalPageEditFormInjection)
  }
})

export default Component.extend({
  tag: 'page-edit-form',
  view: template,
  leakScope: false,
  ViewModel: PageEditFormVM
  // , events: {
  //   '* focus': function (target) {
  //     console.log(arguments)
  //   }
  // }
})

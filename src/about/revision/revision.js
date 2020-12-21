import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './revision.stache'
import ckeArea from '~/src/utils/ckeditor-area'

export const AboutRevisionVM = DefineMap.extend('AboutRevisionVM', {
  // passed in via about.stache
  guide: {},

  connectedCallback (el) {
    const data = {
      value: this.guide.notes,
      label: 'Revision Notes',
      change: (notes) => { this.guide.notes = notes },
      name: 'about-revision-notes'
    }
    const ckDiv = ckeArea(data)

    el.append(ckDiv)

    // cleanup element and ckeditor instance
    return () => {
      const ckeInstances = window.CKEDITOR.instances
      for (let name in ckeInstances) {
        ckeInstances[name].destroy()
      }
    }
  }
})

export default Component.extend({
  tag: 'about-revision',
  view: template,
  leakScope: false,
  ViewModel: AboutRevisionVM
})

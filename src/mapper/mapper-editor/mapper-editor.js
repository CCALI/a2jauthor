import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper-editor.stache'

const mirrorProperties = [
  'name'
]

export const MapperEditorVM = DefineMap.extend('MapperEditorVM', {
  // passed in via mapper.stache
  selectedPage: {},
  selectedNodeId: {},
  updateCanvas: {},

  // open the legacy modal editor
  openQDE () {
    const pageName = this.selectedPage.name
    window.gotoPageEdit(pageName)
  },

  connectedCallback (el) {
    const vm = this

    const proxyHandler = (ev, newVal, oldVal) => {
      const guideAttr = ev.type

      // handle page name changes
      if (guideAttr === 'name') {
        const page = window.gGuide.pages[oldVal]
        window.pageRename(page, newVal) // pageRename from A2J_Pages.js line#215
      }

      // update any rendered props in the canvas
      vm.updateCanvas(this.selectedNodeId, guideAttr, newVal)
    }

    const proxySelectedPageProperties = (selectedPage) => {
      mirrorProperties.forEach((prop) => {
        // using the notify queue updates global gGuide instantly
        selectedPage.listenTo(prop, proxyHandler, 'notify')
      })
    }

    const tearDownSelectedPageProxy = (selectedPage) => {
      mirrorProperties.forEach((prop) => {
        selectedPage.stopListening(prop, proxyHandler, 'notify')
      })
    }

    // first proxy setup
    proxySelectedPageProperties(this.selectedPage)

    const selectedPageHandler = (event, newVal, oldVal) => {
      if (oldVal) {
        tearDownSelectedPageProxy(oldVal)
      }
      if (newVal) {
        proxySelectedPageProperties(newVal)
      }
    }

    this.listenTo('selectedPage', selectedPageHandler)

    return function () {
      this.stopListening('selectedPage', selectedPageHandler)
    }
  }
})

export default Component.extend('MapperEditorComponent', {
  view: template,
  tag: 'mapper-editor',
  ViewModel: MapperEditorVM,
  leakScope: false
})

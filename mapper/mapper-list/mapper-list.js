import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper-list.stache'

export const MapperListVM = DefineMap.extend('MapperListVM', {
  // passed in via mapper.stache
  guide: {},
  onSelectPageName: {},
  scrollToSelectedNode: {},
  selectedPageName: {},
  openQDE: {},
  addPage: {},
  addPopup: {},
  pagesAndPopups: {},
  // reference legacy window.collapsedSteps global
  // to track the collapse state of a Step's pages-list
  collapsedSteps: {
    get () {
      return window.collapsedSteps || []
    }
  },

  // checked input toggle means page list for step is expanded
  // which is the opposite of the global 'collapsed' boolean
  isExpanded (stepNumber) {
    return !this.collapsedSteps[stepNumber]
  },

  selectListPageName (pageName) {
    // these functions passed from mapper-canvas.js
    this.onSelectPageName(pageName)
    this.scrollToSelectedNode()
  },

  connectedCallback () {
    const toggleCollapsedHandler = (ev) => {
      // checked === true means not collapsed
      const shouldCollapse = !ev.target.checked
      const stepNumber = parseInt(ev.target.id)
      // this global is also used by the Pages tab
      // TODO: wire them together to track across both tab
      window.collapsedSteps[stepNumber] = shouldCollapse
    }

    // handle click events to toggle and track `collapsed` boolean
    const stepInputs = document.querySelectorAll('input.toggle')
    for (const input of stepInputs) {
      input.addEventListener('change', toggleCollapsedHandler)
    }

    return () => {
      for (const input of stepInputs) {
        input.removeEventListener('change', toggleCollapsedHandler)
      }
    }
  }
})

export default Component.extend('MapperListComponent', {
  view: template,
  tag: 'mapper-list',
  ViewModel: MapperListVM,
  leakScope: false
})

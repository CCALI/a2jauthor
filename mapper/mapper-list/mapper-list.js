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
  // reference legacy window.collapsedSteps global to track collapse state
  collapsedSteps: {
    get () {
      return window.collapsedSteps || []
    }
  },

  restoreCollapsedSteps () {
    if (Object.keys(this.pagesAndPopups) <= 0) { return }

    for (const [stepNumber, stepInfo] of this.pagesAndPopups) {
      const isCollapsed = this.collapsedSteps[stepNumber]
      const targetInput = document.getElementById(stepInfo.toggleTriggerId)
      // steps are checked/expanded by default, remove `checked` to collapse via click()
      if (isCollapsed) {
        targetInput.click()
      }
    }
  },

  selectListPageName (pageName) {
    this.onSelectPageName(pageName)
    // passed from mapper-canvas.js
    this.scrollToSelectedNode()
  },

  connectedCallback () {
    this.restoreCollapsedSteps()

    // update collapsedSteps on click
    const toggleCollapsedHandler = (ev) => {
      // checked === true means not collapsed
      const shouldCollapse = !ev.target.checked
      const stepNumber = parseInt(ev.target.id)
      window.collapsedSteps[stepNumber] = shouldCollapse
    }
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

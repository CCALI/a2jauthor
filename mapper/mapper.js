import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper.stache'

export const MapperVM = DefineMap.extend('MapperVM', {
  // passed in via author app.stache
  guide: {},
  // passed up from mapper-canvas.stache
  openQDE: {},
  addPage: {},
  addPopup: {},
  paper: {},
  graph: {},
  // passed to mapper-list & mapper-canvas
  selectedPageName: {},

  pagesAndPopups: {
    get () {
      const sortedPages = this.guide.attr('sortedPages')
      const guideSteps = this.guide.attr('steps')
      return this.buildPagesAndPopups(sortedPages, guideSteps)
    }
  },

  buildPagesAndPopups (sortedPages, guideSteps) {
    // returns {'0': { displayName: 'STEP 0', pages: [] }, 'popups': { displayName: 'POPUPS', pages: [] } }
    const pagesAndPopups = {}

    guideSteps.forEach((step) => {
      const stepKey = `${step.number}`
      pagesAndPopups[stepKey] = { displayName: 'STEP ' + stepKey, pages: [] }
    })
    // pagesAndPopups['popups'] = { displayName: 'POPUPS', pages: [] }

    sortedPages.forEach(function (page) {
      if (page.type === 'Popup') {
        // TODO: restore after popup step refactor
        // pagesAndPopups['popups'].pages.push(page)
      } else {
        const stepKey = `${page.step}`
        pagesAndPopups[stepKey].pages.push(page)
      }
    })

    return pagesAndPopups
  },

  // tracking the x and y values to use as base values for new mapNodes
  lastCoordinatesByStep: {
    value ({ lastSet, listenTo, resolve }) {
      const vm = this

      const buildCoords = () => {
        const coordsList = new DefineMap()
        Object.keys(vm.pagesAndPopups).forEach((stepKey) => {
          const stepMap = vm.pagesAndPopups[stepKey]
          if (stepMap.pages.length) {
            const stepPages = stepMap.pages
            const lastPage = stepPages[stepPages.length - 1]
            coordsList[stepKey] = { mapx: lastPage.mapx, mapy: lastPage.mapy }
          }
        })
        return coordsList
      }
      resolve(buildCoords())

      listenTo('pagesAndPopups', () => {
        resolve(buildCoords())
      })
    }
  },

  // click handler for selection and highlighting
  onSelectPageName (pageName) {
    this.selectedPageName = pageName
  }
})

export default Component.extend('MapperComponent', {
  view: template,
  tag: 'mapper-page',
  ViewModel: MapperVM,
  leakScope: false
})

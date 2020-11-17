import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper.stache'
import _debounce from 'lodash/debounce'

export const MapperVM = DefineMap.extend('MapperVM', {
  // passed in via author app.stache
  guide: {},
  showTesting: {},
  // passed up from mapper-canvas.stache
  scrollToSelectedNode: {},
  buildingMapper: {},
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

  // returns {'0': { displayName: 'STEP 0', pages: [] }, 'popups': { displayName: 'POPUPS', pages: [] } }
  buildPagesAndPopups (sortedPages, guideSteps) {
    const pagesAndPopups = {}

    guideSteps.forEach((step) => {
      const stepNumber = step.number
      const displayName = 'STEP ' + stepNumber
      pagesAndPopups[stepNumber] = {
        stepNumber,
        displayName,
        pages: []
      }
    })
    // pagesAndPopups['popups'] = { displayName: 'POPUPS', pages: [] }

    sortedPages.forEach(function (page) {
      if (page.type === 'Popup') {
        // TODO: restore after popup step refactor
        // pagesAndPopups['popups'].pages.push(page)
      } else {
        // page.step is the index for a Step in the Steps array, which is not always the same as the step number
        const step = guideSteps[page.step]
        const stepKey = `${step.number}`
        if (pagesAndPopups[stepKey] && pagesAndPopups[stepKey].pages) {
          pagesAndPopups[stepKey].pages.push(page)
        }
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
  },

  connectedCallback (el) {
    const $mapperPage = $(el)
    const $mapperCanvasContainer = $('.mapper-canvas-container')
    const updateCanvasHeight = () => {
      $mapperCanvasContainer.height($mapperPage.height() - 66) // mapper-toolbar 50px, a2j-footer 16px
    }

    // this makes sure the x-axis scroll bar shows at the bottom of the mapper-canvas
    updateCanvasHeight()
    window.addEventListener('resize', updateCanvasHeight)

    return () => {
      window.removeEventListener('resize', _debounce(updateCanvasHeight, 150))
    }
  }
})

export default Component.extend('MapperComponent', {
  view: template,
  tag: 'mapper-page',
  ViewModel: MapperVM,
  leakScope: false
})

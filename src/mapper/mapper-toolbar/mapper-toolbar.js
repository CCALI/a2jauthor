import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper-toolbar.stache'
import { fitToContentOptions } from '../mapper-canvas/jointjs-util'
import $ from 'jquery'

export const MapperToolbarVM = DefineMap.extend('MapperToolbarVM', {
  // jointjs paper & graph passed in from mapper-canvas.stache
  paper: {},
  graph: {},
  buildingMapper: {},

  // passed in from app.stache -> mapper.stache
  showTesting: {},

  // track scale outside of jointjs for zoom math
  scale: {
    default: 1
  },

  displayScale: {
    get () {
      return this.scale && this.scale.toFixed(2)
    }
  },

  showLinks: {
    type: 'boolean',
    default: true
  },

  toggleLinks () {
    this.showLinks = !this.showLinks
    const links = this.graph.getLinks()
    links.forEach((link) => {
      if (this.showLinks) {
        link.attr('./display', '')
      } else {
        link.attr('./display', 'none')
      }
    })
  },

  updateRouter (selectedValue) {
    const links = this.graph.getLinks()
    links.forEach((link) => {
      link.router(selectedValue)
    })
  },

  zoomOut () {
    this.scale = this.scale >= 0.2 ? this.scale - 0.1 : 0.1
    this.paper.scale(this.scale)
  },

  zoomIn () {
    this.scale = this.scale + 0.1
    this.paper.scale(this.scale)
  },

  zoomToWidth () {
    // paper.getContentArea().width never changes so use paper grid width to get multiplier
    const mapperContainerWidth = $('.mapper-canvas-container').width()
    const paperBackgroundWidth = $('.joint-paper-grid').width()
    const multiplier = Math.floor((mapperContainerWidth / paperBackgroundWidth) * 10) / 10
    const currentScale = this.paper.scale().sx
    const newScale = Math.floor((currentScale * multiplier) * 10) / 10

    // ensure reasonable minimum scale
    this.scale = newScale < 0.1 ? 0.1 : newScale
    this.paper.scale(this.scale)
  },

  resetZoom () {
    this.scale = 1
    this.paper.scale(this.scale)
  },

  autoCleanup () {
    this.buildingMapper = true
    const elementCells = this.graph.getElements()
    const lastMapY = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]

    setTimeout(() => {
      // TODO: these values should be computed by nodeSize constant(s)
      elementCells.forEach(function (cell) {
        const stepNumber = cell.attributes.stepNumber === 'popups' ? 0 : parseInt(cell.attributes.stepNumber)

        const newX = stepNumber === 0 ? 60 : (stepNumber * 180) + 60
        const newY = lastMapY[stepNumber]
        lastMapY[stepNumber] = newY + 240

        cell.set('position', { x: newX, y: newY })
      })

      this.paper.fitToContent(fitToContentOptions)
      this.buildingMapper = false
    })
  },

  // This is for testing and only shows in non-production environments
  postItNightmare () {
    this.buildingMapper = true
    const elementCells = this.graph.getElements()
    let getX = () => Math.random() * 1201
    let getY = () => Math.random() * 801
    setTimeout(() => {
      elementCells.forEach((cell) => {
        cell.position(getX(), getY())
      })
      this.paper.fitToContent(fitToContentOptions)
      this.buildingMapper = false
    })
  }
})

/**
 * @module {function} components/mapper/toolbar/ <mapper-toolbar>
 * @parent api-components
 * @signature `<mapper-toolbar>`
 *
 * Displays buttons that allow user to open, delete, clone and upload interviews.
 */
export default Component.extend({
  ViewModel: MapperToolbarVM,
  view: template,
  leakScope: false,
  tag: 'mapper-toolbar'
})

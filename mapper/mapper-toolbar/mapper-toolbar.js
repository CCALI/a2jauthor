import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper-toolbar.stache'
import { fitToContentOptions } from '../mapper-canvas/jointjs-util'
import $ from 'jquery'

export const MapperToolbarVM = DefineMap.extend('MapperToolbarVM', {
  // jointjs paper & graph passed in from mapper-canvas.stache
  paper: {},
  graph: {},

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
    this.scale = this.scale * 0.9
    this.paper.scale(this.scale)
  },

  zoomIn () {
    this.scale = this.scale * 1.1
    this.paper.scale(this.scale)
  },

  zoomToWidth () {
    const mapperPageWidth = $('mapper-canvas').width()
    const area = this.paper.getContentArea()
    const paperWidth = area.width
    this.scale = mapperPageWidth / paperWidth
    this.paper.scale(this.scale)
  },

  resetZoom () {
    this.scale = 1
    this.paper.scale(this.scale)
  },

  autoCleanup () {
    const cells = this.graph.getCells()
    const lastMapY = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]

    // TODO: these values should be dictated to computed by nodeSize constant(s)
    cells.forEach((cell) => {
      const stepNumber = cell.attributes.stepNumber === 'popups' ? 0 : parseInt(cell.attributes.stepNumber)

      const newX = stepNumber === 0 ? 60 : (stepNumber * 180) + 60
      const newY = lastMapY[stepNumber]
      lastMapY[stepNumber] = newY + 240

      cell.position(newX, newY)
    })

    this.paper.fitToContent(fitToContentOptions)
  },

  postItNightmare () {
    const cells = this.graph.getCells()
    let getX = () => Math.random() * 801
    let getY = () => Math.random() * 601
    // TODO: these values should be dictated to computed by nodeSize constant(s)
    cells.forEach((cell) => {
      cell.position(getX(), getY())
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

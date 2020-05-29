import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './mapper-canvas.stache'
import $ from 'jquery'
import _debounce from 'lodash/debounce'
import constants from 'caja/viewer/models/constants'
import queues from 'can-queues'

import {
  buildPaper,
  makeLink,
  makeNode,
  fitToContentOptions
} from './jointjs-util'

export const MapperCanvasVM = DefineMap.extend('MapperCanvasVM', {
  // passed in via mapper.stache
  guide: {},
  onSelectPageName: {},
  selectedPageName: {},
  pagesAndPopups: {},
  lastCoordinatesByStep: {},
  buildingMapper: { default: true },
  mapperLoadingMessage: { default: 'Building Mapper ... ' },

  // JointJS/Canvas related props
  paper: {}, // jointjs paper instance/view - set in connectedCallback()
  graph: { // jointjs paper.model that backs the paper view above
    get () {
      return this.paper && this.paper.model
    }
  },
  selectedNodeId: { // selected graph model to match view below
    get () {
      return this.selectedPageName && this.pageNameToMapId[this.selectedPageName]
    }
  },
  selectedNodeView: { // currently selected node in paper view(canvas)
    get () {
      return this.selectedNodeId && this.paper.findViewByModel(this.selectedNodeId)
    }
  },

  lastActiveCellView: {}, /** track last active cellView to unhighlight */

  cellQueue: { // used to queue up nodes and links for initial rendering
    default: () => []
  },

  pageNameToMapId: { // maps canjs page.name to jointjs cell Ids (nodes and links)
    default: () => new DefineMap()
  },

  mapIdToPageName: { // maps jointjs cell Ids (nodes and links) to canjs page.name
    default: () => new DefineMap()
  },

  highlighterOptions: { // used to highlight a selected node
    get () {
      return {
        name: 'stroke',
        options: {
          padding: 15,
          rx: 5,
          ry: 5,
          attrs: {
            'stroke-width': 3,
            stroke: '#FFA000'
          }
        }
      }
    }
  },

  isSpecialButton (button) {
    return button.next === constants.qIDFAIL ||
    button.next === constants.qIDEXIT ||
    button.next === constants.qIDSUCCESS ||
    button.next === constants.qIDASSEMBLESUCCESS ||
    button.next === constants.qIDASSEMBLE ||
    button.next === constants.qIDBACK ||
    button.next === constants.qIDRESUME
  },

  // nodes and links functions
  enqueueCell (mapNodeOrLink) {
    this.cellQueue.push(mapNodeOrLink)
  },

  createNode (page) {
    const mapNode = makeNode(page)
    page.mapId = mapNode.id

    // map in and out ports by name
    this.pageNameToMapId[page.name] = mapNode.id
    this.mapIdToPageName[mapNode.id] = page.name

    return mapNode
  },

  // TODO: this seems to be an expensive operation - maybe a better way?
  getNodeOutPortLinks (mapNode) { // returns only links that this mapNode as it's source
    return this.graph.getConnectedLinks(mapNode).filter((link) => link.source().id === mapNode.id)
  },

  updateButtonLinks (mapNode) {
    // filter out any links not originating from this mapNode, we only care about 'out' port links
    const outPortLinks = this.getNodeOutPortLinks(mapNode)
    const pageName = this.mapIdToPageName[mapNode.id]
    const page = this.guide.pages[pageName]
    const buttons = page.buttons

    const maxButtonList = [1, 2, 3]

    maxButtonList.forEach((buttonNumber, index) => {
      const button = buttons[index]
      const previousLink = outPortLinks[index]
      const isSpecialButton = button && this.isSpecialButton(button)
      const hasNowhereTarget = button && button.next === constants.qIDNOWHERE
      // cleanup links for removed buttons, special target buttons, and empty string targets ''
      if (previousLink) {
        const targetId = this.pageNameToMapId[button.next]
        if (!button || isSpecialButton || hasNowhereTarget) {
          previousLink.remove()
        } else if (previousLink.target().id !== targetId) { // update the link target as needed
          previousLink.target({ id: targetId, port: 'in' })
        }
      } else if (button && button.next && !isSpecialButton) { // brand new button link
        const targetId = this.pageNameToMapId[button.next]
        const link = makeLink(mapNode.id, buttonNumber, targetId, 'in')
        this.graph.addCell(link)
      }
    })
  },

  updateButtonHighlighting (mapNode) {
    const pageName = this.mapIdToPageName[mapNode.id]
    const page = this.guide.pages[pageName]
    const numButtons = page.buttons.length

    if (mapNode.attributes.outPorts.length) { // no length means popup with no buttons
      for (let i = 1; i < 4; i++) {
        const outPort = i.toString()
        const buttonIndex = i - 1
        const button = page.buttons[buttonIndex]
        if (i <= numButtons) {
          if (this.isSpecialButton(button)) {
            this.highlightSpecialButton(mapNode, outPort)
          } else {
            this.highlightButton(mapNode, outPort)
          }
        } else {
          this.unhighlightButton(mapNode, outPort)
        }
      }
    }
  },

  // TODO: move the highlight functions into jointjs-util.js
  // and possibly standardize on taking a mapNode (get cellView from that)
  highlightButton (mapNode, outPort) {
    mapNode.portProp(outPort, 'attrs/circle/fill', '#FFAA00')
    mapNode.portProp(outPort, 'attrs/circle/strokeWidth', 1)
  },

  unhighlightButton (mapNode, outPort) {
    mapNode.portProp(outPort, 'attrs/circle/fill', '#BEBEBE')
    mapNode.portProp(outPort, 'attrs/circle/strokeWidth', 1)
  },

  highlightSpecialButton (mapNode, outPort) {
    mapNode.portProp(outPort, 'attrs/circle/fill', '#FFAA00')
    mapNode.portProp(outPort, 'attrs/circle/strokeWidth', 4)
  },

  removeCellHighlighter (cellView) {
    cellView.unhighlight(null/* defaults to cellView.el */, {
      highlighter: this.highlighterOptions
    })
  },

  highlightCellView (cellView) {
    if (this.lastActiveCellView) {
      this.removeCellHighlighter(this.lastActiveCellView)
    }

    cellView.highlight(null/* defaults to cellView.el */, {
      highlighter: this.highlighterOptions
    })

    this.lastActiveCellView = cellView
  },

  openQDE (pageName) { // Question Design Editor Modal
    const vm = this
    // legacy code call
    window.gotoPageEdit(pageName)
    const cellView = this.selectedNodeView

    // update canvas node with any name updates
    const $pageEditDialog = $('.page-edit-form')
    $pageEditDialog.dialog({
      'beforeClose': function () {
        const newPageName = $pageEditDialog.attr('rel')
        if (pageName !== newPageName) {
          const nodeModel = cellView.model
          // update name/mapId mappings
          vm.pageNameToMapId[newPageName] = nodeModel.id
          vm.mapIdToPageName[nodeModel.id] = newPageName
          delete vm.pageNameToMapId[[pageName]]
          // update selected and canvas attrs/views
          vm.onSelectPageName(newPageName)
          // TODO: derive the ./label/text somehow?
          cellView.model.attributes.pageName = newPageName
          cellView.model.attr('.label/text', newPageName)
        }
      }
    })
  },

  addPage (newStep) {
    const isPopup = newStep === 'popups'
    const stepIndex = isPopup ? 0 : parseInt(newStep)
    const lastCoordinates = this.lastCoordinatesByStep[stepIndex]
    // TODO: mapx/mapy math should be based on nodeSize
    const lastX = lastCoordinates && lastCoordinates.mapx
    const mapx = lastX || (stepIndex === 0 ? 60 : (stepIndex * 180) + 60)
    const lastY = lastCoordinates && lastCoordinates.mapy
    const mapy = !lastY ? 60 : lastY + 240

    const newPageName = isPopup ? window.pagePopupEditNew(mapx, mapy) : window.pageEditNew(stepIndex, mapx, mapy)
    window.guideSave()
    const newPage = window.gGuide.pages[newPageName]
    const newMapNode = this.createNode(newPage)
    this.graph.addCell(newMapNode)
    // TODO: padding should be added to nodeSize constant
    this.paper.fitToContent(fitToContentOptions)
    // auto select the new added page
    this.onSelectPageName(newPageName)
  },

  sortAndSaveGuidePages () {
    window.gGuide.sortPages()
    window.guideSave()
  },

  initMapper (paper) {
    const vm = this
    const graph = paper.options.model
    vm.guide.sortedPages.forEach((page) => {
      // TODO: remove when popups are handled in code refactor
      if (page.type === 'Popup') { return }
      const mapNode = vm.createNode(page)
      // highlight active/inactive buttons
      vm.updateButtonHighlighting(mapNode)
      vm.enqueueCell(mapNode)
    })

    // resetCells updates all the cells at once before drawing them for performance
    // TODO: will need to change if we do async paper for performance <-- likely to happen
    graph.resetCells(vm.cellQueue)
    vm.cellQueue = []

    // nodes/elements are made first as you need their ids to make links
    vm.guide.sortedPages.forEach((page) => {
      // popup pages don't have links
      if (page.type === 'Popup') { return }
      const mapNode = graph.getCell(page.mapId)

      page.buttons.forEach((button, index) => {
        const buttonNumber = index + 1
        if (button.next && !vm.isSpecialButton(button)) {
          const targetId = this.pageNameToMapId[button.next]
          const link = makeLink(mapNode.id, buttonNumber, targetId, 'in')
          vm.enqueueCell(link)
        }
      })
    })

    graph.addCells(vm.cellQueue)
    vm.cellQueue = []

    // turn off build spinner
    vm.buildingMapper = false

    return paper
  },

  // this bootstraps the relationship between jointjs canvas and canjs state/models/events
  connectedCallback () {
    // TODO: remove global vm
    const vm = window.vm = this

    // TODO - this may cause circular events in jointjs-util.js
    vm.listenTo('node-position-update', _debounce(this.sortAndSaveGuidePages, 30))

    vm.listenTo('selectedNodeView', function () {
      if (vm.selectedNodeView) {
        vm.highlightCellView(vm.selectedNodeView)
      }
    })

    // if guide saves, make sure the current selected page's buttons are updated
    vm.listenTo('guide', function () {
      const selectedPageHasLinks = vm.selectedPageName && vm.guide.pages[vm.selectedPageName].type !== 'Popup'
      // popup pages don't have buttons/links
      if (selectedPageHasLinks) {
        const mapNode = vm.graph.getCell(vm.selectedNodeId)
        vm.updateButtonLinks(mapNode)
        vm.updateButtonHighlighting(mapNode)
      }
    })

    // create jointjs paper canvas/view and graph model
    vm.paper = buildPaper(vm)

    // mutateQueue let's the dom update with the spinner while the expensive work
    // of adding the mapper nodes can happen after
    queues.mutateQueue.enqueue(vm.initMapper, vm, [ vm.paper ])

    // cleanup event listeners
    return () => {
      vm.graph.off()
      vm.paper.stopListening()
      vm.stopListening('node-position-update')
      vm.stopListening('selectedNodeView')
      vm.stopListening('guide')
    }
  }
})

export default Component.extend('MapperCanvasComponent', {
  view: template,
  tag: 'mapper-canvas',
  ViewModel: MapperCanvasVM,
  leakScope: false
})

import { dia, shapes, util } from 'jointjs'

// settings/constants for layout
export const gridSize = 10
export const nodeSize = { height: 120, width: 120 }
export const mapPadding = { top: nodeSize.height / 2, right: nodeSize.width / 2, bottom: nodeSize.height * 1.5, left: nodeSize.width / 2 }
export const fitToContentOptions = {
  padding: { top: mapPadding.top, right: mapPadding.right, bottom: mapPadding.bottom, left: mapPadding.left }
}

export const stepBackgroundMap = {
  '0': '#EFEFC6',
  '1': '#EFEF8C',
  '2': '#EFC6EF',
  '3': '#EFC6C6',
  '4': '#EF8CEF',
  '5': '#EF8C8C',
  '6': '#C6EFEF',
  '7': '#C6EFC6',
  '8': '#C6C6EF',
  '9': '#C6C68C',
  '10': '#C68CC6',
  '11': '#C68C8C',
  '12': '#8CEFEF',
  '13': '#8CEF8C',
  '14': '#8CC6C6',
  '15': '#8CC68C'
}

/** jointjs paper/graph code and event listeners */
export const buildPaper = (vm, width, height) => {
  // create graph model
  const graph = new dia.Graph()
  // return paper canvas
  const paper = new dia.Paper({
    el: document.getElementById('mapper-canvas'),
    model: graph,
    width: width || 1000,
    height: height || 1000,
    gridSize: gridSize,
    drawGrid: true,
    background: {
      color: 'rgba(255, 255, 255, 0.3)'
    },
    // Enable link connection within 50px lookup radius of port
    snapLinks: { radius: 50 },
    defaultRouter: {
      name: 'metro'
    }
  })

  // events
  handlePaperEvents(paper, vm)
  handleGraphEvents(graph, vm)

  return paper
}

export const makeLink = (sourceId, sourcePort, targetId, targetPort) => {
  return new dia.Link({
    source: { id: sourceId, port: sourcePort },
    target: { id: targetId, port: targetPort }
  })
}

export const makeNode = (page) => {
  const inPorts = page.type !== 'Popup' ? ['in'] : []
  const outPorts = page.type !== 'Popup' ? ['1', '2', '3'] : []
  return new shapes.devs.Model({
    stepNumber: parseInt(page.step),
    pageName: page.name,
    position: { x: page.mapx || nodeSize.width / 2, y: page.mapy || nodeSize.height },
    size: { height: nodeSize.height, width: nodeSize.width },
    inPorts: inPorts,
    outPorts: outPorts,
    ports: {
      groups: {
        'in': {
          attrs: {
            '.port-body': {
              fill: '#00ccff',
              magnet: 'passive'
            }
          },
          label: {
            position: {
              name: 'top', args: { y: 5 }
            }
          },
          position: {
            name: 'top',
            args: {}
          }
        },
        'out': {
          attrs: {
            '.port-body': {
              fill: '#BEBEBE',
              stroke: '#000',
              strokeWidth: 1
            }
          },
          label: {
            position: {
              name: 'top', args: { x: -1, y: -12 }
            }
          },
          position: {
            name: 'bottom',
            args: {}
          }
        }
      }
    },
    attrs: {
      '.label': { text: util.breakText(page.name, { width: nodeSize.width, height: nodeSize.height }, { 'font-size': 13 }, { ellipsis: true }), 'ref-x': 0.5, 'ref-y': 0.2 },
      rect: { fill: stepBackgroundMap[page.step] }
    }
  })
}

const handlePaperEvents = (paper, vm) => {
  // adjust paper grid (with padding options) to new content scale
  paper.on('scale', function () {
    paper.fitToContent(fitToContentOptions)
  })

  paper.on('element:pointerdown', function (cellView) {
    // updating the pageName will cascade highlight events in mapper-list and mapper-canvas
    const pageName = cellView.model.attributes.pageName
    vm.onSelectPageName(pageName)
  })

  paper.on('blank:pointerdown', function (cellView) {
    // clear highlight for selected node/item in page list
    if (vm.lastActiveCellView) {
      vm.removeCellHighlighter(vm.lastActiveCellView)
    }
    vm.onSelectPageName('')
  })

  paper.on('element:pointerdblclick', function (child, ev) {
    const pageName = child.model.attributes.pageName
    // open QDE full editor
    vm.openQDE(pageName)
  })

  paper.on('cell:pointermove', function (cellView, evt, x, y) {
    const bBox = cellView.getBBox()
    const paperWidth = cellView.paper.options.width
    const paperHeight = cellView.paper.options.height
    let constrained = false
    let constrainedX = x
    if (bBox.x <= 0) {
      constrainedX = x + gridSize
      constrained = true
    }
    if ((bBox.x + bBox.width) >= paperWidth) {
      constrainedX = x - gridSize
      constrained = true
    }

    let constrainedY = y
    if (bBox.y <= 0) {
      constrainedY = y + gridSize
      constrained = true
    }
    // 132 is header + mapper-toolbar height
    if ((bBox.y + bBox.height + 132) >= paperHeight) {
      constrainedY = y - gridSize
      constrained = true
    }

    // if you fire the event all the time you get a stack overflow
    if (constrained) { cellView.pointermove(evt, constrainedX, constrainedY) }
  })
}

const handleGraphEvents = (graph, vm) => {
  graph.on('change:target', function (link, target) {
    // only in ports can be targets
    if (!target.port || target.port !== 'in') { return }

    const source = link.get('source')
    const sourcePort = source.port
    const sourceCell = link.getSourceCell()

    const sourcePageName = sourceCell.attributes.pageName
    const sourcePage = vm.guide.pages[sourcePageName]
    const gGuideSourcePage = window.gGuide.pages[sourcePageName]
    const buttonIndex = parseInt(sourcePort) - 1

    const targetPageName = vm.mapIdToPageName[target.id]

    // add new button on link if doesn't exist
    if (!sourcePage.buttons[buttonIndex]) {
      const button = new window.TButton()
      button.label = 'Button ' + (buttonIndex + 1)
      sourcePage.buttons[buttonIndex] = button
      gGuideSourcePage.buttons[buttonIndex] = button
      // make new button orange/active
      sourceCell.portProp(sourcePort, 'attrs/circle/fill', '#ffaa00')
    }

    gGuideSourcePage.buttons[buttonIndex].next = targetPageName
    sourcePage.buttons[buttonIndex].next = targetPageName
    vm.updateButtonHighlighting(sourceCell)
  })

  graph.on('remove', function (cell, collection, opt) {
    if (cell.isLink()) {
      const source = cell.attributes.source
      const sourcePort = source.port + ''
      const sourceCell = collection.graph.getCell(source.id)

      const sourceButtonIndex = parseInt(sourcePort) - 1
      const sourcePageName = sourceCell.attributes.pageName
      const sourcePage = vm.guide.pages[sourcePageName]
      const gGuidePage = window.gGuide.pages[sourcePageName]

      if (sourcePage.buttons[sourceButtonIndex]) {
        sourcePage.buttons[sourceButtonIndex].next = ''
        gGuidePage.buttons[sourceButtonIndex].next = ''
      }
    }
  })

  graph.on('change:position', function (element, position) {
    const pageName = element.attributes.attrs['.label'].text
    const page = vm.guide.attr('pages')[pageName]
    const gGuidePage = window.gGuide.pages[pageName]
    if (!page || !gGuidePage) { return }
    page.mapx = position.x
    page.mapy = position.y
    // TODO: this should save to proxy/save to gGuide via some event
    gGuidePage.mapx = position.x
    gGuidePage.mapy = position.y
    // This dispatched event is debounced/handled in MapperCanvasVM
    vm.dispatch('node-position-update')
  })
}

// TODO: useful paper events ?
// paper.on('link:connect', function () {
//   console.log('link connect')
// })
// paper.on('link:disconnect', function () {
//   console.log('link disconnect')
// })

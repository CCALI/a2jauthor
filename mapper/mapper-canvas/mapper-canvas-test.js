import { assert } from 'chai'
import { MapperCanvasVM } from './mapper-canvas'

import 'steal-mocha'

describe('<mapper-canvas>', () => {
  describe('ViewModel', () => {
    let vm
    beforeEach(() => {
      vm = new MapperCanvasVM({
        guide: {
          pages: {
            'intro': {name: 'intro', mapx: 42, mapy: 24, step: '0', buttons: [{label: 'Continue', next: 'address'}]},
            'address': {name: 'address', mapx: 60, mapy: 60, step: '1', buttons: [{label: 'Continue', next: 'lasers'}]},
            'lasers': {name: 'lasers', mapx: 60, mapy: 120, step: '1', buttons: [{label: 'Continue', next: ''}, {label: 'Return', next: 'intro'}]}
          },
          sortedPages: [
            {name: 'address', mapx: 60, mapy: 60, step: '1', buttons: [{label: 'Continue', next: 'lasers'}]},
            {name: 'intro', mapx: 42, mapy: 24, step: '0', buttons: [{label: 'Continue', next: 'address'}]},
            {name: 'lasers', mapx: 60, mapy: 120, step: '1', buttons: [{label: 'Continue', next: ''}, {label: 'Return', next: 'intro'}]}
          ]
        }
      })
    })

    it('createNode()', () => {
      const page = vm.guide.pages['intro']
      const mapNode = vm.createNode(page)

      assert.equal(mapNode.attributes.pageName, 'intro', 'should add page.name to the node')
      assert.equal(mapNode.attributes.stepNumber, '0', 'should add page.step to the node')
      assert.equal(mapNode.attributes.position.x, 42, 'should set position.x on the node')
      assert.equal(mapNode.attributes.position.y, 24, 'should set position.y the node')
      assert.equal(mapNode.attr('.label/text'), 'intro', 'the label text should be set to page.name')
    })

    it('enqueueCell()', () => {
      vm.enqueueCell({ id: '12' })
      vm.enqueueCell({ id: '34' })
      vm.enqueueCell({ id: '56' })
      assert.equal(vm.cellQueue.length, 3, 'should add cells to the queue for rendering')
    })

    it('getNodeOutPortLinks()', () => {
      // create starting nodes, links, and name <-> id DefineMaps
      vm.connectedCallback()

      const nodeId = vm.pageNameToMapId['intro']
      const mapNode = vm.graph.getCell(nodeId)
      const ourPortLinks = vm.getNodeOutPortLinks(mapNode)
      assert.equal(ourPortLinks.length, 1, 'should only return out ports - aka this mapNode is link source')
    })

    it('updateButtonLinks()', () => {
      // create starting nodes, links, and name <-> id DefineMaps
      vm.connectedCallback()

      const page = vm.guide.pages['intro']
      const nodeId = vm.pageNameToMapId['intro']
      const mapNode = vm.graph.getCell(nodeId)

      let outPorts = vm.getNodeOutPortLinks(mapNode)
      assert.equal(outPorts.length, 1, 'should start with 1 out link')

      page.buttons.push({ label: 'foo', next: '' })
      vm.updateButtonLinks(mapNode)
      outPorts = vm.getNodeOutPortLinks(mapNode)
      assert.equal(outPorts.length, 1, 'should not add link if no next target')

      page.buttons[1].next = 'address'
      vm.updateButtonLinks(mapNode)
      outPorts = vm.getNodeOutPortLinks(mapNode)
      assert.equal(outPorts.length, 2, 'should add link if next target is added')

      page.buttons.pop()
      vm.updateButtonLinks(mapNode)
      outPorts = vm.getNodeOutPortLinks(mapNode)
      assert.equal(outPorts.length, 1, 'should remove a link if button removed')
    })

    it('updateButtonHighlighting()', () => {
      // create starting nodes, links, and name <-> id DefineMaps
      vm.connectedCallback()
      const page = vm.guide.pages['intro']
      const nodeId = vm.pageNameToMapId['intro']
      const mapNode = vm.graph.getCell(nodeId)

      let outPortColor = mapNode.portProp('2', 'attrs/circle/fill')
      assert.equal(outPortColor, '#BEBEBE', 'port 2 should grey(BEBEBE) when no button')

      page.buttons.push({ label: 'foo', next: 'lasers' })
      vm.updateButtonHighlighting(mapNode)

      outPortColor = mapNode.portProp('2', 'attrs/circle/fill')
      assert.equal(outPortColor, '#FFAA00', 'port 2 should update to orange(FFAA00) when button present')

      page.buttons.pop()
      vm.updateButtonHighlighting(mapNode)

      outPortColor = mapNode.portProp('2', 'attrs/circle/fill')
      assert.equal(outPortColor, '#BEBEBE', 'port 2 should go back to grey(BEBEBE) when button removed')
    })

    it('highlightCellView()', () => {
      vm.connectedCallback()
      let nodeId = vm.pageNameToMapId['intro']
      const firstCellView = vm.paper.findViewByModel(nodeId)
      vm.highlightCellView(firstCellView)

      let hasHighlight = firstCellView.$el.find('.joint-highlight-stroke').length === 1
      assert.isTrue(hasHighlight, 'should highlight the cell')
      assert.equal(vm.lastActiveCellView.id, firstCellView.id, 'should set lastActiveCellView for future highlight removal')

      nodeId = vm.pageNameToMapId['lasers']
      const secondCellView = vm.paper.findViewByModel(nodeId)
      vm.highlightCellView(secondCellView)

      hasHighlight = firstCellView.$el.find('.joint-highlight-stroke').length === 1
      assert.isFalse(hasHighlight, 'should remove highlight from the previous cell')

      hasHighlight = secondCellView.$el.find('.joint-highlight-stroke').length === 1
      assert.isTrue(hasHighlight, 'should highlight the new cell')
      assert.equal(vm.lastActiveCellView.id, secondCellView.id, 'should set lastActiveCellView for future highlight removal')
    })
  })
})

import F from 'funcunit'
import CanMap from 'can-map'
import { assert } from 'chai'
import Templates from './templates-vm'
import A2JTemplate from 'caja/author/models/a2j-template'
import stache from 'can-stache'
import 'caja/author/models/fixtures/templates'

import 'can-route'
import 'steal-mocha'
import './templates'

describe('<templates-page>', function () {
  describe('viewModel', function () {
    let vm

    beforeEach(function () {
      window.localStorage.clear()
      vm = new Templates({
        appState: new CanMap()
      })
    })

    afterEach(function () {
      window.localStorage.clear()
    })

    it('defaults activeFilter to "active" status', function () {
      assert.equal(vm.attr('activeFilter'), 'active')
    })

    it('defaults "sortCriteria" to "buildOrder" asc', function () {
      assert.deepEqual(vm.attr('sortCriteria').attr(), {
        key: 'buildOrder',
        direction: 'asc'
      })
    })

    it('returns a newly ordered list of templateIds', function () {
      const templatesSource = [{ templateId: 1, active: true }, { templateId: 2, active: true }, { templateId: 3, active: true }]
      vm.attr('templates', new A2JTemplate.List(templatesSource))
      const templates = vm.attr('templates')

      const currentTemplateIdOrder = templatesSource.map(t => t.templateId)
      const moveTemplate = templates.pop()
      templates.unshift(moveTemplate)
      const newTemplateIdOrder = vm.updateTemplatesOrder()

      assert.deepEqual(currentTemplateIdOrder, [1, 2, 3])
      assert.deepEqual(newTemplateIdOrder, [3, 1, 2])
    })
  })

  describe('Component', function () {
    beforeEach(function (done) {
      let appState = new CanMap({
        guideId: '1261',
        guide: { title: '' }
      })

      let frag = stache(
        '<templates-page appState:bind="appState" />'
      )

      $('#test-area').html(frag({ appState }))

      F('templates-list-item').size(size => size > 0)
      F(done)
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('renders a list of active templates by default', function (done) {
      F(function () {
        let templates = $('templates-page')[0].viewModel.attr('displayList')
        let deleted = templates.filter(template => !template.attr('active'))
        assert.equal(deleted.attr('length'), 0, 'should not have deleted templates')
      })

      F(done)
    })

    it('rendered list is sorted by buildOrder asc by default', function (done) {
      F(function () {
        let templates = $('templates-page')[0].viewModel.attr('displayList')
        let buildOrder = templates.attr().map(template => template.buildOrder)
        assert.deepEqual(buildOrder, [2, 3], 'should be sorted asc')
      })

      F(done)
    })

    it.skip('deleted templates are filtered out properly', function (done) {
      let delay = 0
      let totalActive

      F(function () {
        totalActive = $('templates-list-item').length

        // set transition time to 0ms, to speed up the test
        $('templates-list')[0].viewModel.attr('itemTransitionTime', delay)

        // set hovered to true to display the delete template link
        $('templates-list-item').first()[0].viewModel.attr('hovered', true)
      })

      F('templates-list-item .delete').size(1, 'delete link should be on screen')

      F('templates-list-item .delete').click()

      F(function () {
        let current = $('templates-list-item').length
        assert.equal(current, totalActive - 1, 'there should be one less')
      })

      F(done)
    })

    it('displays alert if there are no search results', function (done) {
      F(function () {
        $('templates-page')[0].viewModel.attr('searchToken', '123456789')
      })

      F('templates-list-item').size(0)
      F('.no-results').visible('no results message should be visible')
      F(done)
    })

    it('displays alert if there are no templates', function (done) {
      // replace component's template list with an empty array.
      F(function () {
        $('templates-page')[0].viewModel.attr('templates').replace([])
      })

      F('.no-templates-exist').visible('no templates message should be visible')
      F(done)
    })

    it.skip('displays alert if no templates match filters', function (done) {
      F(function () {
        let vm = $('templates-page')[0].viewModel

        // mark all templates as deleted
        vm.attr('templates').forEach(template => template.attr('active', false))
      })

      F('.no-match-filter').visible('no templates match "active" filter')
      F('.no-match-filter').text(/no templates match/i)
      F(done)
    })

    it('displays alert if there are no templates in the trash', function (done) {
      F(function () {
        let vm = $('templates-page')[0].viewModel

        // mark all templates as active and set filter to deleted.
        vm.attr('templates').forEach(template => template.attr('active', true))
        vm.attr('activeFilter', 'deleted')
      })

      F('.no-match-filter').visible('no templates match "active" filter')
      F('.no-match-filter').text(/no templates in the trash/i)
      F(done)
    })
  })
})

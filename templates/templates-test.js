import $ from 'jquery'
import F from 'funcunit'
import { assert } from 'chai'
import Templates from './templates-vm'
import stache from 'can-stache'
import 'a2jauthor/models/fixtures/templates'
import '@caliorg/a2jstyles/styles.less'

import 'can-route'
import 'steal-mocha'
import './templates'

describe('<templates-page>', function () {
  describe('viewModel', function () {
    let vm

    beforeEach(function () {
      vm = new Templates({})
    })

    afterEach(function () {
      vm = null
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
  })

  describe('Component', function () {
    beforeEach(function (done) {
      const frag = stache(
        '<templates-page guideId:from="guideId" guideTitle:from="guide.title" />'
      )

      $('#test-area').html(frag({
        guideId: '1261', // 1261 has 3 templates by default
        guide: { title: '' }
      }))

      F('templates-list-item').size(size => {
        console.log('size', size)
        return size > 0
      })
      F(done)
    })

    afterEach(function (done) {
      $('#test-area').empty()
      done()
    })

    it('renders a list of active templates by default', function (done) {
      F(function () {
        let templates = $('templates-page')[0].viewModel.attr('displayList')
        assert(templates.attr('length'), 3, 'should start with 3 templates')
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

    it('deleted templates are filtered out properly', function (done) {
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

    it('displays alert if no templates match filters', function (done) {
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

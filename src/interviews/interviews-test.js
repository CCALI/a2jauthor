import $ from 'jquery'
import F from 'funcunit'
import { assert } from 'chai'
import stache from 'can-stache'
import CanList from 'can-list'
import CanMap from 'can-map'
import { InterviewsVM } from './interviews'
import '../models/fixtures/'
import domEvents from 'can-dom-events'

import 'steal-mocha'

describe('<interviews-page>', function () {
  describe('viewModel', function () {
    let vm = null

    beforeEach(function () {
      vm = new InterviewsVM()
    })

    it('clearPreviewState()', function () {
      vm.previewInterview = new CanMap({ answers: {} })

      vm.clearPreviewState()
      assert.equal(vm.previewInterview, undefined, 'should clear previewInterview by setting to undefined')
    })

    it('deleteInterview works', function (done) {
      const interviewsPromiseResponse = new CanList([
        { id: 1, title: 'foo', owned: true },
        { id: 2, title: 'bar', owned: true }
      ])

      vm = new InterviewsVM({
        interviewsPromise: Promise.resolve(interviewsPromiseResponse)
      })

      vm.listenTo('interviews', () => {
        assert.equal(vm.interviews.length, 20,
          'there should be 2 interviews')
        // delete interview with id 1
        vm.deleteInterview(1)

        assert.equal(vm.interviews.length, 1,
          'interview with id 1 should have been deleted')

        // delete interview with id 5
        vm.deleteInterview(5)

        assert.equal(vm.interviews.length, 1,
          'should still be 1 since there is no interview with given id')
      })
      vm.stopListening()
      done()
    })
  })

  describe('Component', function () {
    let vm
    const selectedClass = 'item-selected'
    const openedClass = 'guide-opened'

    beforeEach(function (done) {
      const frag = stache('<interviews-page></interviews-page>')
      $('#test-area').html(frag())
      vm = $('interviews-page')[0].viewModel

      F('.guide').size(n => n > 0)
      F(done)
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('lists interviews fetched from the server', function () {
      assert.isTrue($('.guide').length > 0, 'interviews should be listed')
    })

    it('interviews are set as selected when clicked', function () {
      const interview = $('.guide').eq(0)

      assert.isFalse(interview.hasClass(selectedClass))
      domEvents.dispatch(interview[0], 'click')
      assert.isTrue(interview.hasClass(selectedClass))
    })

    window.openSelectedGuide = (gid) => {
      vm.currentGuideId = gid
    }

    it('interviews are set as opened when double clicked', function () {
      const interview = $('.guide').eq(2)
      // merge tool link changed the location of the link this test was clicking.
      // eq(1) is the merge tool entry point now

      assert.isFalse(interview.hasClass(openedClass))
      domEvents.dispatch(interview[0], 'dblclick')
      assert.isTrue(interview.hasClass(openedClass))
    })

    it('only one interview can be opened', function (done) {
      F('.guide').hasClass(openedClass, false, 'there should be no opened interview')

      // select first interview of the list
      F('.guide:eq(2)').dblclick()

      F('.guide:eq(2)').hasClass(openedClass, true, 'should be opened')
      F('.' + openedClass).size(1, 'there should be one opened interview')

      // select second interview of the list
      F('.guide:eq(3)').dblclick()

      F('.guide:eq(3)').hasClass(openedClass, true, 'should be opened')
      F('.' + openedClass).size(1, 'there should be one opened interview')

      F(done)
    })
  })
})

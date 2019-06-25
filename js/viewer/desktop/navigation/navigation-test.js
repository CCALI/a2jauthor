import $ from 'jquery'
import { assert } from 'chai'
import stache from 'can-stache'
import AppState from 'caja/viewer/models/app-state'
import Interview from 'caja/viewer/models/interview'
import constants from 'caja/viewer/models/constants'
import { ViewerNavigationVM } from 'caja/viewer/desktop/navigation/'
import canReflect from 'can-reflect'
import 'caja/viewer/models/fixtures/'

import 'steal-mocha'

describe('<a2j-viewer-navigation>', function () {
  describe('viewModel', function () {
    let vm
    let pages
    let visited
    let rState
    let interview

    beforeEach(function (done) {
      let promise = Interview.findOne({ url: '/interview.json' })

      promise.then(function (_interview) {
        interview = _interview
        rState = new AppState({ interview })
        pages = interview.attr('pages')
        visited = canReflect.getKeyValue(rState, 'visitedPages')
        vm = new ViewerNavigationVM({ rState, interview })

        done()
      })
    })

    it('collects feedback form data', function () {
      // simulate user is on interview second page.
      let secondPage = pages.attr(1)
      vm.attr('selectedPageName', secondPage.attr('name'))

      assert.deepEqual(vm.attr('feedbackData'), {
        questionid: secondPage.attr('name'),
        questiontext: secondPage.attr('text'),
        interviewid: interview.attr('version'),
        viewerversion: constants.A2JVersionNum,
        emailto: interview.attr('emailContact'),
        interviewtitle: interview.attr('title')
      })
    })

    it('canSaveAndExit', function () {
      // true only if rState.lastPageBeforeExit has a non falsy value
      // and interview.attr('exitPage') NOT being constants.qIDNOWHERE
      rState.lastPageBeforeExit = ''
      interview.attr('exitPage', constants.qIDNOWHERE)
      assert.isFalse(vm.attr('canSaveAndExit'))

      // lastPageBeforeExit having a value means you've already hit Save&Exit button
      rState.lastPageBeforeExit = '2-Name'
      interview.attr('exitPage', '1-Exit')
      assert.isFalse(vm.attr('canSaveAndExit'))

      // exit page assigned, but Save&Exit button not hit
      rState.lastPageBeforeExit = ''
      interview.attr('exitPage', '1-Exit')
      assert.isTrue(vm.attr('canSaveAndExit'))
    })

    it('canResumeInterview - whether Resume button should be enabled', function () {
      rState.lastPageBeforeExit = ''
      assert.isFalse(vm.attr('canResumeInterview'))

      rState.lastPageBeforeExit = '1-Intro'
      assert.isTrue(vm.attr('canResumeInterview'))
    })

    it('canNavigateBack - whether back button should be enabled', function () {
      // navigate to first page
      visited.unshift(pages.attr(0))
      vm.attr('selectedPageIndex', 0)
      assert.isFalse(vm.attr('canNavigateBack'), 'false if only one page visited')

      // navigate to second page
      visited.unshift(pages.attr(1))
      vm.attr('selectedPageIndex', 0)
      assert.isTrue(vm.attr('canNavigateBack'), 'true when on last page')

      // go back to first page
      vm.attr('selectedPageIndex', 1)
      assert.isFalse(vm.attr('canNavigateBack'), 'false when on first page')
    })

    it('canNavigateForward - whether next button should be enabled', function () {
      // navigate to first page
      visited.unshift(pages.attr(0))
      vm.attr('selectedPageIndex', 0)
      assert.isFalse(vm.attr('canNavigateForward'), 'false if only one page visited')

      // navigate to second page
      visited.unshift(pages.attr(1))
      vm.attr('selectedPageIndex', 0)
      assert.isFalse(vm.attr('canNavigateForward'), 'false when on the last page')

      // go back to first page
      vm.attr('selectedPageIndex', 1)
      assert.isTrue(vm.attr('canNavigateForward'), 'true when on the first page')
    })

    it('navigateBack', () => {
      visited.unshift(pages.attr(2))
      visited.unshift(pages.attr(1))
      visited.unshift(pages.attr(0))

      // select most recent page
      vm.attr('selectedPageIndex', 0)

      vm.navigateBack()
      assert.equal(vm.attr('selectedPageIndex'), 1, 'should navigate to middle page')

      vm.navigateBack()
      assert.equal(vm.attr('selectedPageIndex'), 2, 'should navigate to oldest page')
    })

    it('navigateForward', () => {
      visited.unshift(pages.attr(2))
      visited.unshift(pages.attr(1))
      visited.unshift(pages.attr(0))

      // select oldest page
      vm.attr('selectedPageIndex', 2)

      vm.navigateForward()
      assert.equal(vm.attr('selectedPageIndex'), 1, 'should navigate to middle page')

      vm.navigateForward()
      assert.equal(vm.attr('selectedPageIndex'), 0, 'should navigate to most recent page')
    })

    it('disableOption', () => {
      assert.equal(vm.disableOption(0), false, 'false by default even with index 0')

      // saveAndExitActive is derived from rState.lastPageBeforeExit having a value
      rState.lastPageBeforeExit = '2-Name'
      assert.equal(vm.disableOption(0), false, 'false if index is 0 and saveAndExitActive is true')
      assert.equal(vm.disableOption(1), true, 'true if index is NOT 0 and saveAndExitActive is true')
    })
  })

  describe('Component', function () {
    let pages
    let visited
    let interview
    let rState
    let vm // eslint-disable-line
    let lang

    beforeEach(function (done) {
      let promise = Interview.findOne({ url: '/interview.json' })

      promise.then(function (_interview) {
        interview = _interview
        rState = new AppState()
        lang = {
          GoNext: 'Next',
          GoBack: 'Back',
          MyProgress: 'My Progress',
          SaveAndExit: 'Save & Exit',
          ResumeExit: 'Resume',
          SendFeedback: 'Send Feedback'
        }

        pages = interview.attr('pages')
        visited = canReflect.getKeyValue(rState, 'visitedPages')
        vm = new ViewerNavigationVM({ rState, interview, lang })

        let frag = stache(
          `<a2j-viewer-navigation interview:from="interview"
            rState:from="rState" lang:from="lang"
            showDemoNotice:bind="showDemoNotice" />`
        )

        $('#test-area').html(frag({
          rState,
          interview,
          lang,
          showDemoNotice: false
        }))
        done()
      })
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('renders pages history dropdown', function () {
      // navigate to first page
      visited.unshift(pages.attr(0))
      assert.equal($('select option').length, 1, 'just one page visited')

      // navigate to second page
      visited.unshift(pages.attr(1))
      assert.equal($('select option').length, 2, 'two pages visited')
    })

    it('truncates dropdown text so it fits properly', function () {
      let firstPage = pages.attr(0)

      visited.unshift(firstPage)
      assert.isTrue(firstPage.attr('text').length > 40, 'very long text')

      // making sure the firstPage is selected
      let $selectedOption = $('option:selected')
      assert.equal($('option:selected').val(), 0)

      let optionText = $selectedOption.text().trim()
      assert.isTrue(optionText.length <= 40, 'should be truncated')
    })

    it('shows/hides feedback button based on interview.sendfeedback', function () {
      // turn off feedback
      interview.attr('sendfeedback', false)
      assert.equal($('.send-feedback').length, 0, 'Feedback button should not be rendered')

      // turn on feedback
      interview.attr('sendfeedback', true)
      assert.equal($('.send-feedback').length, 1, 'Feedback button should be rendered')
    })

    it('shows/hides Exit button based on vm.canSaveAndExit', function () {
      // turn off Exit button following properties result in canSaveAndExit being false
      interview.attr('exitPage', constants.qIDNOWHERE)
      assert.equal($('.can-exit').length, 0, 'Exit button should not be rendered')

      // turn on Exit button only with valid Exit Point
      interview.attr('exitPage', '1-Exit')
      assert.equal($('.can-exit').length, 1, 'Exit button should be rendered')
    })

    it('shows/hides Resume button based on vm.canSaveAndExit', function () {
      // turn off Resume button when saveAndExitActive is false even when lastPageBeforeExit has a value
      rState.lastPageBeforeExit = '1-Intro'
      assert.equal($('.can-exit').length, 0, 'Resume button should not be rendered')

      // turn on Resume button when Exit button has been clicked
      rState.lastPageBeforeExit = '1-Intro'
      assert.equal($('.can-resume').length, 1, 'Resume button should be rendered')
    })

    it('shows custom courthouse image if provided', function () {
      let vm = $('a2j-viewer-navigation')[0].viewModel
      vm.attr('courthouseImage', 'my-custom-courthouse.jpg')

      let courthouseSrc = $('img.courthouse').attr('src')
      assert.equal(courthouseSrc, 'my-custom-courthouse.jpg')
    })

    it('uses default courthouse image when custom not provided', function () {
      let vm = $('a2j-viewer-navigation')[0].viewModel
      vm.attr('courthouseImage', null)

      let courthouseSrc = $('img.courthouse').attr('src')
      assert.isTrue(courthouseSrc.indexOf('A2J5_CourtHouse.svg') !== -1)
    })
  })
})

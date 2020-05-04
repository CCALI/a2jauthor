import { assert } from 'chai'
import { ReportVM } from './report'

import 'steal-mocha'

// ViewModel unit tests
describe('<report-page>', () => {
  describe('viewModel', () => {
    let vm

    beforeEach(() => {
      vm = new ReportVM()
    })

    it('selectedReport', () => {
      assert.equal(vm.attr('selectedReport'), 'fullReport', 'initial value should be fullReport')
    })

    it('buildingReport', () => {
      let originalGuide = window.gGuide
      window.gGuide = {}

      assert.equal(vm.attr('buildingReport'), false, 'should be false when no guide loaded')
      window.gGuide = originalGuide
    })

    it('hideDefault', () => {
      assert.equal(vm.attr('hideDefault'), false, 'hideDefault should start at false')

      vm.attr('selectedReport', 'textReport')
      assert.equal(vm.attr('hideDefault'), true, 'should be true if selectedReport is textReport')

      vm.attr('selectedReport', 'citationReport')
      assert.equal(vm.attr('hideDefault'), true, 'should be true if selectedReport is citationReport')
    })

    it('hideText', () => {
      assert.equal(vm.attr('hideText'), false, 'hideText should start at false')

      vm.attr('selectedReport', 'citationReport')
      assert.equal(vm.attr('hideText'), true, 'should be true if selectedReport is citationReport')
    })

    it('hideCitation', () => {
      assert.equal(vm.attr('hideCitation'), false, 'hideCitation should start at false')
      vm.attr('selectedReport', 'textReport')
      assert.equal(vm.attr('hideCitation'), true, 'should be true if selectedReport is textReport')
    })

    it('pagesAndPopups and buildPagesByStep', () => {
      const sortedPages = [
        { type: 'a2j', step: '0' },
        { type: 'a2j', step: '1' },
        { type: 'a2j', step: '1' },
        { type: 'Popup' }
      ]

      const steps = [
        { text: 'intro', number: '0' },
        { text: 'info', number: '1' }
      ]

      const guide = { sortedPages, steps }
      vm.attr('guide', guide)

      let promise = vm.attr('pagesAndPopups')

      return promise.then((pagesAndPopups) => {
        assert.equal(pagesAndPopups.length, 2, 'pagesAndPopups should be a 2 element array')
        const step0pages = pagesAndPopups[0][0].pages
        const step1pages = pagesAndPopups[0][1].pages
        const popups = pagesAndPopups[1]

        assert.equal(step0pages.length, 1, 'did not sort step 0 pages correctly')
        assert.equal(step1pages.length, 2, 'did not sort step 1 pages correctly')
        assert.equal(popups.length, 1, 'did not sort out popup pages correctly')
      })
    })

    it('sortedVariableList and getVariableList', () => {
      const guide = {}
      guide.vars = [
        { name: 'First Name' },
        { name: 'User Gender' },
        { name: 'Last Name' }
      ]

      vm.attr('guide', guide)

      const sortedVariableList = vm.attr('sortedVariableList')
      const expectedOrder = [
        { name: 'First Name' },
        { name: 'Last Name' },
        { name: 'User Gender' }
      ]

      assert.equal(sortedVariableList[0].name, expectedOrder[0].name, 'variable list did not sort correctly')
      assert.equal(sortedVariableList[1].name, expectedOrder[1].name, 'variable list did not sort correctly')
      assert.equal(sortedVariableList[2].name, expectedOrder[2].name, 'variable list did not sort correctly')
    })

    it('displayLanguage', () => {
      const guide = { language: 'en' }
      vm.attr('guide', guide)

      window.Languages = {
        regional: {
          en: { locale: 'en', Language: 'English', LanguageEN: 'English' } }
      }

      const displayLanguage = vm.attr('displayLanguage')
      assert.equal(displayLanguage, 'English (English) {en}', 'display language is wrong or improperly formatted')
    })
  })
})

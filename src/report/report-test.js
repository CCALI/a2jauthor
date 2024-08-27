import { assert } from 'chai'
import { ReportVM } from './report'
import DefineMap from 'can-define/map/map'

import 'steal-mocha'

// ViewModel unit tests
describe('<report-page>', () => {
  describe('viewModel', () => {
    let vm

    beforeEach(() => {
      vm = new ReportVM()
    })

    it('selectedReport', () => {
      assert.equal(vm.selectedReport, 'fullReport', 'initial value should be fullReport')
    })

    it('buildingReport', () => {
      const originalGuide = window.gGuide
      window.gGuide = undefined

      assert.equal(vm.buildingReport, false, 'should be false when no guide loaded')
      window.gGuide = originalGuide
    })

    it('hideDefault', () => {
      assert.equal(vm.hideDefault, false, 'hideDefault should start at false')

      vm.selectedReport = 'textReport'
      assert.equal(vm.hideDefault, true, 'should be true if selectedReport is textReport')

      vm.selectedReport = 'citationReport'
      assert.equal(vm.hideDefault, true, 'should be true if selectedReport is citationReport')
    })

    it('hideText', () => {
      assert.equal(vm.hideText, false, 'hideText should start at false')

      vm.selectedReport = 'citationReport'
      assert.equal(vm.hideText, true, 'should be true if selectedReport is citationReport')
    })

    it('hideCitation', () => {
      assert.equal(vm.hideCitation, false, 'hideCitation should start at false')
      vm.selectedReport = 'textReport'
      assert.equal(vm.hideCitation, true, 'should be true if selectedReport is textReport')
    })

    it('pagesAndPopups and buildPagesByStep', () => {
      const sortedPages = [
        { type: 'a2j', step: '0', fields: [] },
        { type: 'a2j', step: '1', fields: [] },
        { type: 'a2j', step: '1', fields: [] },
        { type: 'Popup', fields: [] }
      ]

      const steps = [
        { text: 'intro', number: '0' },
        { text: 'info', number: '1' }
      ]

      const guide = { sortedPages, steps }
      vm.guide = guide

      const promise = vm.pagesAndPopups

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
      const guide = new DefineMap({
        vars: {
          'first name': { name: 'First Name' },
          'user gender': { name: 'User Gender' },
          'last name': { name: 'Last Name' }
        }
      })
      vm.guide = guide

      const sortedVariableList = vm.sortedVariableList
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
      vm.guide = guide

      window.Languages = {
        regional: { en: { locale: 'en', Language: 'English', LanguageEN: 'English' } }
      }

      const displayLanguage = vm.displayLanguage
      assert.equal(displayLanguage, 'English (English) {en}', 'display language is wrong or improperly formatted')
    })
  })
})

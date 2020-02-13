import './viewer/A2J_Types'
import './viewer/A2J_Prefs'
import './viewer/A2J_SharedSus'
import './viewer/A2J_Shared'
import './viewer/A2J_Logic'
import 'jquery'
import './A2J_Pages'
import './A2J_Tabs'
import 'jquery-ui/ui/widgets/autocomplete'

import { assert } from 'chai'
import 'steal-mocha'

describe('src/A2J_Pages', function () {
  beforeEach(() => {
    window.gGuide = new window.TGuide()
    const intro = new window.TPage()
    intro.name = 'intro'
    intro.buttons[0] = {label: 'Continue', next: 'page2'}
    const page2 = new window.TPage()
    page2.name = 'page2'
    page2.buttons[0] = {label: 'Continue', next: ''}
    window.gGuide.pages = { intro, page2 }
  })

  afterEach(() => { // cleanup globals
    window.gGuide = null
  })

  it('pageFindReferences', function () {
    const matches = window.gGuide.pageFindReferences('page2', null)
    assert.equal(matches.length, 1, 'should find references in button.next targets')
    assert.equal(matches[0].next, 'page2', 'should not rename next target if newName not passed')

    const renameMatches = window.gGuide.pageFindReferences('page2', 'lasercats')
    assert.equal(renameMatches.length, 1, 'should find references in button.next targets')
    assert.equal(renameMatches[0].next, 'lasercats', 'should rename next target if newName is passed')
  })

  it('buildPopupQDE', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0
    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3'
    }

    const $popupQDE = window.buildPopupQDE(page)
    assert.equal($popupQDE[0].elements.length, 4, 'should create popup QDE with 4 elements')
    window.gGuideID = undefined
  })

  it('buildPageFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0

    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3'
    }

    const $pageFieldSet = window.buildPageFieldSet(page)
    assert.equal($pageFieldSet[0].elements.length, 2, 'should create pageFieldSet with 2 elements')

    window.gGuideID = undefined
  })

  it('buildQuestionFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0

    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3'
    }

    const $buildQuestionFieldSet = window.buildQuestionFieldSet(page)
    assert.equal($buildQuestionFieldSet[0].elements.length, 5, 'should create buildQuestionFieldSet with 5 elements')

    window.gGuideID = undefined
  })

  it('buildLearnMoreFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0

    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3'
    }

    const $buildLearnMoreFieldSet = window.buildLearnMoreFieldSet(page)
    assert.equal($buildLearnMoreFieldSet[0].elements.length, 11, 'should create buildQuestionFieldSet with 5 elements')

    window.gGuideID = undefined
  })

  it('guidePageEditForm', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0
    const field = new window.TField()

    const page = { // A2J type triggers new page creation
      type: 'A2J',
      fields: [field]
    }

    const $guidePageEditForm = window.guidePageEditForm(page)
    assert.equal($guidePageEditForm[0].elements.length, 14, 'should create buildQuestionFieldSet with 5 elements')

    window.gGuideID = undefined
  })
})

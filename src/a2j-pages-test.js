import $ from 'jquery'
import './viewer/A2J_Types'
import './viewer/A2J_Prefs'
import './viewer/A2J_SharedSus'
import './viewer/A2J_Shared'
import './viewer/A2J_Logic'
import './viewer/A2J_Languages'
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

  it('handleNullButtonTargets', function () {
    const buttons = [
      {label: 'Continue', next: '1-Question'},
      {label: 'Continue', next: null},
      {label: 'Continue', next: undefined}
    ]
    const expectedButtons = [
      {label: 'Continue', next: '1-Question'},
      {label: 'Continue', next: ''},
      {label: 'Continue', next: ''}
    ]

      const updatedButtons = window.handleNullButtonTargets(buttons)
      assert.deepEqual(expectedButtons, updatedButtons, 'should replace button.next targets of `null` or `undefined` with empty string')
  })

  it('buildPopupFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0
    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3',
      buttons: [],
      fields: []
    }

    const $popupFieldset = window.buildPopupFieldSet(page)
    assert.equal($popupFieldset[0].elements.length, 4, 'should create popup Fieldset with 4 elements')
    window.gGuideID = undefined
  })

  it('buildPageFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0

    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3',
      buttons: [],
      fields: []
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
      textAudioURL: 'someFile.mp3',
      buttons: [],
      fields: []
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
      textAudioURL: 'someFile.mp3',
      buttons: [],
      fields: []
    }

    const $buildLearnMoreFieldSet = window.buildLearnMoreFieldSet(page)
    assert.equal($buildLearnMoreFieldSet[0].elements.length, 11, 'should create buildQuestionFieldSet with 11 elements')

    window.gGuideID = undefined
  })

  it('buildFieldsFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0

    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3',
      buttons: [],
      fields: []
    }

    const $buildFieldsFieldSet = window.buildFieldsFieldSet(page)
    assert.equal($buildFieldsFieldSet[0].elements.length, 1, 'should create buildFieldsFieldSet with 1 element')

    window.gGuideID = undefined
  })

  it('buildButtonFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0

    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3',
      buttons: [],
      fields: []
    }

    const $buildButtonFieldSet = window.buildButtonFieldSet(page)
    assert.equal($buildButtonFieldSet[0].elements.length, 1, 'should create buildButtonFieldSet with 1 element')

    window.gGuideID = undefined
  })

  it('buildLogicFieldSet', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0
    // no op for domMutate
    window.can = {
      domMutate: {
        onNodeRemoval: () => { return false }
      }
    }

    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3',
      buttons: [],
      fields: []
    }

    const $buildLogicFieldSet = window.buildLogicFieldSet(page)
    const logicText = $buildLogicFieldSet.text()
    const includesBeforeLogic = logicText.includes('Before:')
    const includesAfterLogic = logicText.includes('After:')
    assert.equal(includesBeforeLogic, true, 'should create buildLogicFieldSet with page.codeBefore input')
    assert.equal(includesAfterLogic, true, 'should create buildLogicFieldSet with page.codeAfter input')

    window.gGuideID = undefined
  })

  it('guidePageEditForm', function () {
    // this prevents an error trying to upload the fake mp3 file below
    window.gGuideID = 0
    var $qdeParentDiv = window.$('<div></div>')

    // no op for domMutate
    window.can = {
      domMutate: {
        onNodeRemoval: () => { return false }
      }
    }

    const field = new window.TField()
    const page = {
      name: 'Information',
      text: 'This is important info',
      notes: 'no notes',
      textAudioURL: 'someFile.mp3',
      buttons: [{next: 'page2', label: 'Continue', name: ''}],
      fields: [field]
    }

    const $guidePageEditForm = window.guidePageEditForm(page, $qdeParentDiv)
    const fieldSets = $guidePageEditForm.find('fieldset')
    assert.equal(fieldSets.length, 6, 'should create 6 QDE fieldsets: Page, Question, Learn More, Fields, Buttons, Logic')

    window.gGuideID = undefined
  })
})

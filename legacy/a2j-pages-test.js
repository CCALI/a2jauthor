import $ from 'jquery'
import './viewer/A2J_Types'
import './viewer/A2J_SharedSus'
import './viewer/A2J_Shared'
import './viewer/A2J_Logic'
import './viewer/A2J_Languages'
import './viewer/A2J_Parser'
import './A2J_Pages'
import './A2J_Tabs'
import 'jquery-ui/ui/widgets/autocomplete'
import ckeArea from '~/src/utils/ckeditor-area'

import { assert } from 'chai'
import 'steal-mocha'

describe('legacy/A2J_Pages', function () {
  beforeEach(() => {
    window.ckeArea = ckeArea
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
    window.ckeArea = null
    window.gGuide = null
  })

  it('pageFindReferences', function () {
    window.gGuide.firstPage = 'page2'
    window.gGuide.exitPage = 'page2'

    const matches = window.gGuide.pageFindReferences('page2', null)
    assert.equal(matches.length, 3, 'should find references in button.next targets and start/exit pages')
    assert.equal(matches[0].next, 'page2', 'should not rename next target if newName not passed')
    assert.equal(matches[1].text, 'page2', 'should not rename starting page target if newName not passed')
    assert.equal(matches[2].text, 'page2', 'should not rename exit page target if newName not passed')

    const renameMatches = window.gGuide.pageFindReferences('page2', 'lasercats')
    assert.equal(renameMatches.length, 3, 'should find references in button.next targets and start/exit pages')
    assert.equal(renameMatches[0].next, 'lasercats', 'should rename next target if newName is passed')
    assert.equal(renameMatches[1].text, 'lasercats', 'should rename starting target if newName is passed')
    assert.equal(renameMatches[2].text, 'lasercats', 'should rename exit target if newName is passed')
  })

  it('handleNullButtonTargets', function () {
    let buttons = [
      {label: 'Continue', next: '1-Question'},
      {label: 'Continue', next: null},
      {label: 'Continue', next: undefined}
    ]
    let expectedButtons = [
      {label: 'Continue', next: '1-Question'},
      {label: 'Continue', next: ''},
      {label: 'Continue', next: ''}
    ]
    let updatedButtons = window.handleNullButtonTargets(buttons)

    assert.deepEqual(expectedButtons, updatedButtons, 'should replace button.next targets of `null` or `undefined` with empty string')

    buttons = []
    expectedButtons = []
    updatedButtons = window.handleNullButtonTargets(buttons)

    assert.deepEqual(expectedButtons, updatedButtons, 'should do nothing if button does not exist')
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

  it('helpAltText change handler', function () {
    const mockPage = { helpAltText: '' }
    const dirtyAltText = 'Too much $%^ punctuation!! and     "whitespace" for 1'
    const result = window.helpAltTextChangeHandler(dirtyAltText, mockPage)
    const expectedResult = 'Too much punctuation and whitespace for 1'

    assert.equal(result, expectedResult, 'should clear all unsafe characters leaving only letters, digits, and single whitespace')
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
    // TODO: this test is failing on Travis due to too many dependencies on A2J_Tabs.js
    // need refactor to break up that coupling/cascade
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

    // overload some coupled functions for Travis tests
    window.form.listManager.save = function () { return page.fields }
    window.form.tableRowAdjust = function () { }
    window.lang.scriptErrorUnhandled = { printf: function () { } }

    const $guidePageEditForm = window.guidePageEditForm(page, $qdeParentDiv)
    const fieldSets = $guidePageEditForm.find('fieldset')
    assert.equal(fieldSets.length, 6, 'should create 6 QDE fieldsets: Page, Question, Learn More, Fields, Buttons, Logic')

    // cleanup
    window.gGuideID = undefined
  })

  it('createNewPage', () => {
    let newStep = 1
    const mapx = 0
    const mapy = 0
    let createdPage
    let selectedPageName = ''

    // overload globals
    const oldGetSelectedPageName = window.getSelectedPageName
    window.getSelectedPageName = () => selectedPageName
    const oldGuide = window.gGuide
    window.gGuide = new TGuide()

    // fired from mapper, new page becomes 'selected page'
    createdPage = createNewPage (newStep, mapx, mapy)
    assert.equal(createdPage.name, 'New Page', 'should default to New Page if fired from Map tab')

    // no newStep means fired from Pages tab, no selectedPage here
    newStep = null
    window.gGuide.pages = {}
    createdPage = createNewPage (newStep, mapx, mapy)
    assert.equal(createdPage.name, 'New Page', 'should default to New Page if fired from Pages tab & no selectedPage value')

    // fired from Pages tab with a selectedPage
    selectedPageName = 'Intro'
    const introPage = new TPage()
    introPage.name = 'Intro'
    window.gGuide.pages['Intro'] = introPage

    createdPage = createNewPage (newStep, mapx, mapy)
    assert.equal(createdPage.name, 'Intro 2', 'should base new page on current selectedPage in Pages tab')

    // restore globals
    window.getSelectedPageName = oldGetSelectedPageName
    window.gGuide = oldGuide
  })
})

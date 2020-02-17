import './viewer/A2J_Types'
import './viewer/A2J_Prefs'
import './viewer/A2J_SharedSus'
import './viewer/A2J_Logic'
import 'jquery'
import './A2J_Pages'

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
})

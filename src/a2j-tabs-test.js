import './viewer/A2J_Types'
// import './viewer/A2J_Prefs'
// import './viewer/A2J_SharedSus'
// import './viewer/A2J_Logic'
import 'jquery'
import './A2J_Tabs'

import { assert } from 'chai'
import 'steal-mocha'

describe('src/A2J_Tabs', function () {
  beforeEach(() => {
    window.gGuide = new window.TGuide()

    const page2 = new window.TPage()

    const field = new window.TField()
    field.name = 'User Avatar'
    field.label = 'someField'

    page2.name = 'page2'
    page2.buttons[0] = {label: 'Continue', next: '', name: 'User Avatar'}
    page2.fields = [field]
    window.gGuide.pages = { 'page2': page2 }
  })

  afterEach(() => { // cleanup globals
    window.gGuide = null
  })

  describe('vcGatherUsage', function () {
    it('gathers usage on Fields using variables', function () {
      const foundMessage = window.vcGatherUsage('User Avatar')
      const usedInField = foundMessage.indexOf('Field Variable') !== -1
      assert.isTrue(usedInField, 'should find references in field.name for variable usage')
    })

    it('gathers usage on Buttons using variables', function () {
      const foundMessage = window.vcGatherUsage('User Avatar')
      const usedInButton = foundMessage.indexOf('Button Variable') !== -1
      assert.isTrue(usedInButton, 'should find references in button.name for variable usage')
    })

    it('gathers usage on Question Text using variables as macros', function () {
      window.gGuide.pages['page2'].text = 'Q text %%[User Avatar]%%'
      const foundMessage = window.vcGatherUsage('User Avatar')
      const usedInQuestion = foundMessage.indexOf('Question Text') !== -1
      assert.isTrue(usedInQuestion, 'should find references in page.text for variable usage')
    })

    it('gathers usage on LearnMore Response text using variables as macros', function () {
      window.gGuide.pages['page2'].help = 'Learn More text uses %%[User Avatar]%%'
      const foundMessage = window.vcGatherUsage('User Avatar')
      const usedInResponse = foundMessage.indexOf('LearnMore Response') !== -1
      assert.isTrue(usedInResponse, 'should find references in page.help for variable usage')
    })

    it('gathers usage on LearnMore Prompt text using variables as macros', function () {
      window.gGuide.pages['page2'].learn = 'Learn More prompt uses %%[User Avatar]%%'
      const foundMessage = window.vcGatherUsage('User Avatar')
      const usedInPrompt = foundMessage.indexOf('LearnMore Prompt') !== -1
      assert.isTrue(usedInPrompt, 'should find references in page.learn for variable usage')
    })

    it('gathers usage on codeBefore and/or codeAfter Logic using variables', function () {
      window.gGuide.pages['page2'].codeBefore = 'SET [User Avatar] TO "foo"'
      let foundMessage = window.vcGatherUsage('User Avatar')
      const usedInCodeBefore = foundMessage.indexOf('Logic') !== -1
      assert.isTrue(usedInCodeBefore, 'should find references in page.codeBefore for variable usage')

      // clear codeBefore to test codeAfter
      window.gGuide.pages['page2'].codeBefore = ''
      window.gGuide.pages['page2'].codeAfter = 'SET [User Avatar] TO "bar"'
      foundMessage = window.vcGatherUsage('User Avatar')
      const usedInHelp = foundMessage.indexOf('Logic') !== -1
      assert.isTrue(usedInHelp, 'should find references in page.codeAfter for variable usage')
    })
  })
})

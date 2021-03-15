import { assert } from 'chai'
import AppState from 'a2jauthor/src/models/app-state'

import 'steal-mocha'

describe('AppState', function () {
  let appState

  beforeEach(function () {
    appState = new AppState()
  })

  it('resumeEdit()', function () {
    const oldGotoPageEdit = window.gotoPageEdit
    let qdeTargetPage = ''
    window.gotoPageEdit = (targetPageName) => { qdeTargetPage = targetPageName }
    appState.page = 'preview'

    appState.resumeEdit()
    assert.equal(appState.page, 'pages', 'should restore Author to pages tab')
    assert.equal(qdeTargetPage, '', 'should not open QDE if no appState.previewPageName or passed in targetPageName')

    appState.previewPageName = 'foo'
    appState.resumeEdit()
    assert.equal(qdeTargetPage, 'foo', 'should open QDE with the previewPageName set during Preview launch')

    appState.previewPageName = 'foo'
    appState.resumeEdit('baz')
    assert.equal(qdeTargetPage, 'baz', 'should open QDE with the targetPageName when passed in via the editThis() button')

    window.gotoPageEdit = oldGotoPageEdit
  })
})

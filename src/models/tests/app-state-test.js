import { assert } from 'chai'
import AppState from 'a2jauthor/src/models/app-state'

import 'steal-mocha'

describe('AppState', function () {
  let appState

  beforeEach(function () {
    appState = new AppState()
  })

  it('showDebugPanel - whether to show variables/trace panel', function () {
    assert.isFalse(appState.showDebugPanel, 'default value')

    appState.page = 'interviews'
    appState.showDebugPanel = true
    assert.isFalse(appState.showDebugPanel,
      'can\'t be true since the panel should only be visible in preview tab')

    appState.page = 'preview'
    appState.showDebugPanel = true
    assert.isTrue(appState.showDebugPanel, 'should be true ')
  })

  it('ckeArea - generate ckeditor div', function () {
    // mock can/domMutate
    window.can = {
      domMutate: {
        onNodeRemoval: () => {}
      }
    }
    const ckeDiv = appState.ckeArea({label: 'some label'})
    assert.equal(ckeDiv.children.length, 2, 'should create a ckeditor div')
  })
})

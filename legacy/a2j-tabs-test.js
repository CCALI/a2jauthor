import './viewer/A2J_Types'
// import './viewer/A2J_Prefs'
// import './viewer/A2J_SharedSus'
// import './viewer/A2J_Logic'
import 'jquery'
import './A2J_Tabs'

import { assert } from 'chai'
import 'steal-mocha'

describe('legacy/A2J_Tabs', function () {
  beforeEach(() => {
    window.gGuide = new window.TGuide()
  })

  afterEach(() => { // cleanup globals
    window.gGuide = null
  })
})

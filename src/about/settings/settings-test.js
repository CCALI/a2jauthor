import { AboutSettingsVM } from './settings'
import { assert } from 'chai'
import GlobalPrefs from 'a2jauthor/src/models/global-preferences'

import 'steal-mocha'

describe('<about-settings>', () => {
  describe('ViewModel', () => {
    it('connectedCallback - loads a2jPrefs', () => {
      const oldPrefs = window.localStorage.getItem('a2jPrefs')
      const vm = new AboutSettingsVM({ gPrefs: new GlobalPrefs() })
      // fake a save
      window.localStorage.setItem('a2jPrefs', JSON.stringify({ showText: 2 }))

      vm.connectedCallback()
      assert.equal(vm.gPrefs.showText, 2, 'should load saved value')

      // restore old prefs or remove test prefs
      oldPrefs ? window.localStorage.setItem('a2jPrefs', oldPrefs) : window.localStorage.removeItem('a2jPrefs')
    })
  })
})

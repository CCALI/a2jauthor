import { assert } from 'chai'
import GlobalPreferences from 'a2jauthor/src/models/global-preferences'

import 'steal-mocha'

describe('GlobalPreferences', function () {
  let globalPrefs

  beforeEach(() => {
    window.localStorage.clear()
    globalPrefs = new GlobalPreferences()
  })

  const expectedDefaults = {
    warnHotDocsNameLength: true,
    showJS: false,
    showLogic: 1,
    showText: 1
  }

  it('GlobalPreferences has reasonable defaults', () => {
    assert.equal(expectedDefaults.warnHotDocsNameLength, globalPrefs.warnHotDocsNameLength, 'defaults to true')
    assert.equal(expectedDefaults.showJS, globalPrefs.showJS, 'defaults to false')
    assert.equal(expectedDefaults.showLogic, globalPrefs.showLogic, 'defaults to 1')
    assert.equal(expectedDefaults.showText, globalPrefs.showText, 'defaults to 1')
  })

  it('GlobalPreferences save()', () => {
    // localStorage stores strings
    const expectedStoredValues = {
      warnHotDocsNameLength: true,
      showJS: false,
      showLogic: 1,
      showText: 1
    }
    // save first
    globalPrefs.save()
    // test all globalPrefs (DefineMap skips methods)
    const a2jPrefs = JSON.parse(window.localStorage.getItem('a2jPrefs'))
    for (let pref in globalPrefs) {
      const storageValue = a2jPrefs[pref]
      if (typeof pref !== 'function') {
        assert.equal(expectedStoredValues[pref], storageValue, 'saved values should match')
      }

      // double check that functions save and load should not be stored
      assert.equal(a2jPrefs['save'], null, 'should not store save function')
      assert.equal(a2jPrefs['load'], null, 'should not store load function')
    }
  })

  it('GlobalPreferences load()', () => {
    // localStorage stores strings
    const expectedStoredValues = {
      warnHotDocsNameLength: false,
      showJS: true,
      showLogic: 2,
      showText: 2
    }
    // emmulate a previous save
    const a2jPrefs = {}
    for (let key in expectedStoredValues) {
      a2jPrefs[key] = expectedStoredValues[key]
    }
    window.localStorage.setItem('a2jPrefs', JSON.stringify(a2jPrefs))

    globalPrefs.load()
    assert.equal(false, globalPrefs.warnHotDocsNameLength, 'loads as false')
    assert.equal(true, globalPrefs.showJS, 'loads as true')
    assert.equal(2, globalPrefs.showLogic, 'loads as 2')
    assert.equal(2, globalPrefs.showText, 'loads as 2')
  })

  it('GlobalPreferences load() handles no previous save or a localStorage.clear() by using defaults', () => {
    globalPrefs.load()

    assert.equal(true, globalPrefs.warnHotDocsNameLength, 'loads default of true')
    assert.equal(false, globalPrefs.showJS, 'loads default of false')
    assert.equal(1, globalPrefs.showLogic, 'loads default of 1')
    assert.equal(1, globalPrefs.showText, 'loads default of 1')
  })
})

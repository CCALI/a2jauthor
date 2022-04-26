import DefineMap from 'can-define/map/map'
import canReflect from 'can-reflect'

/**
 * @module {DefineMap} Prefs
 * @parent api-models
 *
 * global preferences that persist across Guided Interviews.
 */

window.DefineMap = DefineMap
export default DefineMap.extend('GlobalPreferences', {}, {
  // Include warning when var name length exceeds HotDocs length
  warnHotDocsNameLength: {
    default: true
  },
  // Show A2J JavaScript translations
  showJS: {
    default: false
  },
  // Show all logic(2) or just those with content(1)
  showLogic: {
    default: 1
  },
  // Show all text(2) or just those with content(1)
  showText: {
    default: 1
  },

  // Save prefs to HTML5 LocalStorage
  save () {
    const a2jPrefs = {}
    if (typeof (Storage) !== 'undefined') {
      for (const pref in this) {
        if (canReflect.hasKey(this, pref) && typeof this[pref] !== 'function') {
          a2jPrefs[pref] = this[pref]
        }
      }
      window.localStorage.setItem('a2jPrefs', JSON.stringify(a2jPrefs))
    }
    // courtesy return for testing
    return a2jPrefs
  },
  // Load prefs from HTML5 LocalStorage
  load () {
    if (typeof (Storage) !== 'undefined') {
      const a2jPrefs = JSON.parse(window.localStorage.getItem('a2jPrefs'))
      if (a2jPrefs != null) {
        let storageValue
        try {
          for (const pref in this) {
            storageValue = a2jPrefs[pref]
            if (canReflect.hasKey(this, pref) && typeof this[pref] !== 'function') {
              if (storageValue != null) {
                this[pref] = storageValue
              }
            }
          }
        } catch (e) {
          console.error('Error loading preferences', e)
        }
      }
      // courtesy return for testing
      return a2jPrefs
    }
  }
})

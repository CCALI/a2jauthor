import CanMap from 'can-map'
import Component from 'can-component'
import template from './checkmark-picker.stache'
import { getCheckmarks } from '../index'

export function CheckmarkLoader (checkCache, getCheckmarks) {
  return function getCachedCheckmarks () {
    if (checkCache) {
      return Promise.resolve(checkCache)
    }

    return getCheckmarks().then(checks => {
      checkCache = checks
      return checkCache
    })
  }
}

export const CheckmarkPickerVm = CanMap.extend({
  define: {
    check: {
      type: 'string'
    },

    onCheck: {
      type: 'function'
    },

    checks: {
      value: () => []
    },

    checkError: {
      value: () => null
    },

    isLoadingChecks: {
      type: 'boolean',
      value: () => true
    },

    defaultCheck: {
      type: 'string',
      value: 'normal-check'
    },

    selectedCheck: {
      type: 'string',
      get () {
        const checks = this.attr('checks')
        const check = this.attr('check')
        const hasCheckValue = checks.map(c => c.name).indexOf(check) !== -1
        if (!hasCheckValue) {
          return this.attr('defaultCheck')
        }

        return check
      }
    }
  },

  getChecks: CheckmarkLoader(null, getCheckmarks),

  didInsertElement () {
    this.loadChecks()
  },

  loadChecks () {
    this.attr('isLoadingChecks', true)
    return this.getChecks()
      .then(checks => {
        this.attr({
          checks,
          checkError: null,
          isLoadingChecks: false
        })
      })
      .catch(error => {
        this.attr({
          checks: [],
          checkError: error,
          isLoadingChecks: false
        })
      })
  },

  onSelectCheck (value) {
    this.onCheck(value)
  }
})

export default Component.extend({
  view: template,
  tag: 'checkmark-picker',
  ViewModel: CheckmarkPickerVm,
  leakScope: false,
  events: {
    inserted () {
      this.viewModel.didInsertElement()
    }
  }
})

import CanMap from 'can-map'
import Component from 'can-component'
import template from './sortbar.stache'

import 'can-map-define'

export const Sortbar = CanMap.extend({
  define: {
    criteria: {
      value: {}
    }
  },

  isSortedBy (key) {
    return this.attr('criteria.key') === key
  },

  toggleDirection (direction) {
    return direction === 'asc' ? 'desc' : 'asc'
  },

  setSortCriteria (key) {
    let direction = 'asc'

    if (this.isSortedBy(key)) {
      direction = this.toggleDirection(this.attr('criteria.direction'))
    }

    this.attr('criteria', { key, direction })
  }
})

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: Sortbar,
  tag: 'templates-sortbar',

  helpers: {
    sortCaretClasses (sortKey) {
      const classes = []
      const { key, direction } = this.attr('criteria').attr()

      if (key === sortKey) {
        classes.push('active')
        classes.push(direction === 'asc' ? 'caret-down' : 'caret-up')
      }

      return classes.join(' ')
    }
  }
})

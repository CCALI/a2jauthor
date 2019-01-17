import CanMap from 'can-map'
import Component from 'can-component'
import template from './toolbar.stache'

import 'can-map-define'

export const InterviewToolbarVM = CanMap.extend('InterviewToolbarVM', {
  define: {
    interviews: {}
  }
})
/**
 * @module {function} components/interviews/toolbar/ <interviews-toolbar>
 * @parent api-components
 * @signature `<interviews-toolbar>`
 *
 * Displays buttons that allow user to open, delete, clone and upload interviews.
 */
export default Component.extend({
  ViewModel: InterviewToolbarVM,
  view: template,
  leakScope: false,
  tag: 'interviews-toolbar',

  events: {
    '.open-guide click': function () {
      const selectedGuide = $('a.guide.item-selected').first()
      const gid = selectedGuide[0].getAttribute('gid')
      window.openSelectedGuide(gid)
    },

    '.clone-guide click': function () {
      window.dialogAlert({
        title: 'Clone interview'
      })
    },

    '.delete-guide click': function () {
      window.archiveSelectedGuide()
    }
  }
})

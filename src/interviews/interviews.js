import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import Guide from 'a2jauthor/src/models/guide'
import template from './interviews.stache'

export const InterviewsVM = DefineMap.extend('InterviewsVM', {
  // passed in via author app.stache
  previewInterview: {},
  // passed up via author app.stache
  showDebugPanel: {},

  loadingMessage: {
    get () {
      return `Saving Guide ID: ${this.currentGuideId} ...`
    }
  },

  interviews: {
    value ({ lastSet, listenTo, resolve }) {
      this.interviewsPromise.then((interviews) => {
        resolve(interviews)
      })

      listenTo(lastSet, (interviews) => {
        resolve(interviews)
      })
    }
  },

  interviewsPromise: {
    get  (lastSet) {
      // used to override in tests
      if (lastSet) {
        return lastSet
      }

      return this.saveCurrentGuidePromise
        .then(() => Guide.findAll())
    }
  },

  saveCurrentGuidePromise: {
    get () {
      // this assures any changes to current guide are saved before loading
      // interviews list TODO: remove when legacy code refactored to CanJS
      return new Promise(function (resolve, reject) {
        if (window.gGuide) {
          window.guideSave(resolve)
        } else {
          resolve()
        }
      })
    }
  },

  blankInterview: {
    get () {
      return {
        id: 'a2j',
        title: 'Blank Interview'
      }
    }
  },

  currentGuideId: {
    type: 'string',
    get (lastSet) {
      return lastSet || window.gGuideID
    },
    set (val) {
      return val
    }
  },

  clearPreviewState () {
    // fired on inserted event to clear any Author preview answer/authorMessageLog
    this.showDebugPanel = false

    if (this.traceMessage) {
      this.traceMessage.newMessageLog()
    }

    if (this.previewInterview) {
      this.previewInterview = undefined
    }
  },

  deleteInterview (id) {
    const interviews = this.interviews

    if (interviews) {
      let index = -1

      interviews.forEach(function (interview, i) {
        if (interview.attr('id') === id) {
          index = i
          return false
        }
      })

      if (index !== -1) interviews.splice(index, 1)
    }
  },

  connectedCallback () {
    // clear preview answers even if we don't change interviews
    const vm = this
    vm.clearPreviewState()

    const guideDeletedHandler = function (ev, guideId) {
      vm.deleteInterview(guideId)
    }

    $('#author-app').on('author:guide-deleted', guideDeletedHandler)

    return () => {
      $('#author-app').off('author:guide-deleted', guideDeletedHandler)
    }
  }
})

/**
 * @module {function} components/interviews/ <interviews-page>
 * @parent api-components
 * @signature `<interviews-page>`
 *
 * Displays a list of existing interviews.
 */
export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'interviews-page',
  ViewModel: InterviewsVM,

  helpers: {
    formatFileSize: function (sizeInBytes) {
      sizeInBytes = sizeInBytes()
      let sizeInKB = Math.ceil(sizeInBytes / 1024)
      return sizeInKB ? `${sizeInKB}K` : ''
    }
  },

  events: {
    '.guide click': function (target) {
      const $el = $(this.element)
      $el.find('.guide').removeClass('item-selected')
      $(target).addClass('item-selected')
    },

    '.guide dblclick': function (target) {
      const gid = $(target).attr('gid')
      window.openSelectedGuide(gid)
      // reset collapsed steps tracker in A2J_Tabs
      // TODO: handle this in Pages tab refactor
      window.collapsedSteps = []
    }
  }
})

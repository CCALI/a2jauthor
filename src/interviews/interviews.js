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

  mergeTool: { type: 'boolean', default: false },

  loadingMessage: {
    get () {
      return `Saving Guide ID: ${this.currentGuideId} ...`
    }
  },

  interviews: {
    value (prop) {
      const { lastSet, listenTo, resolve } = prop
      prop.resolver = prop.resolver || (interviews => {
        if (!prop.lastResolved) {
          prop.lastResolved = interviews
        } else {
          prop.lastResolved.replace(interviews)
        }
        resolve(prop.lastResolved)
      })
      this.interviewsPromise.then(prop.resolver)
      listenTo(lastSet, prop.resolver)
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

  scrollToNewFile (gid) {
    if (gid) {
      const $el = $('a[gid="' + gid + '"]')

      if ($el.length) {
        $('a.guide').removeClass('guide-uploaded')
        $el.addClass('guide-uploaded')

        const uploadedGuidePosition = $('.guide-uploaded').offset().top
        const navBarHeight = 140
        const scrollTo = uploadedGuidePosition - navBarHeight

        $('html,body').animate({ scrollTop: scrollTo }, 300)
      }
    }
  },

  reloadInterviews (gid) {
    Guide.findAll().then(i => {
      this.interviews = i
      if (gid) {
        setTimeout(() => this.scrollToNewFile(gid), 100)
      }
      return this.interviews
    })
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
      const sizeInKB = Math.ceil(sizeInBytes / 1024)
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
      if (gid === 'mergeTool') {
        this.viewModel.mergeTool = true
      } else {
        window.openSelectedGuide(gid)
      }
      // reset collapsed steps tracker in A2J_Tabs
      // TODO: handle this in Pages tab refactor
      window.collapsedSteps = []
    }
  }
})

import $ from 'jquery'
import CanMap from 'can-map'
import Component from 'can-component'
import CanList from 'can-list'
import Guide from 'caja/author/models/guide'
import template from './interviews.stache'

import 'can-map-define'

export const InterviewsVM = CanMap.extend({
  define: {
    interviews: {
      serialize: false,
      get (lastSet, resolve) {
        this.attr('interviewsPromise')
          .then(resolve)
      }
    },

    interviewsPromise: {
      serialize: false,
      get  () {
        return this.attr('saveCurrentGuidePromise')
          .then(() => Guide.findAll())
      }
    },

    saveCurrentGuidePromise: {
      get () {
        // this assures any changes to current guide are saved before loading
        // interviews list TODO: remove when legacy code refactored to CanJS
        return new Promise(function (resolve, reject) {
          if (window.gGuide) {
            window.guidesave(resolve)
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

    traceLogicList: {
      serialize: false
    },

    viewerInterview: {
      serialize: false
    },

    currentGuideId: {
      type: 'string',
      get (lastSet) {
        return lastSet || window.gGuideID
      },
      set (val) {
        return val
      }
    }
  },

  clearPreviewState () {
    // fired on inserted event to clear any Author preview answer/tracelogic
    if (this.attr('traceLogicList') && this.attr('traceLogicList').length > 0) {
      this.attr('traceLogicList', new CanList())
    }

    if (this.attr('viewerInterview')) {
      this.attr('viewerInterview').clearAnswers()
    }
  },

  deleteInterview (id) {
    const interviews = this.attr('interviews')

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
    inserted: function () {
      // clear debug-panel traceLogicList and preview answers
      // even if we don't change interviews
      // TODO: this should be moved to happen when a new interview is opened
      const vm = this.viewModel
      vm.clearPreviewState()
    },

    '.guide click': function (target) {
      this.element = $(this.element)
      this.element.find('.guide').removeClass('item-selected')
      $(target).addClass('item-selected')
    },

    '.guide dblclick': function (target) {
      const gid = $(target).attr('gid')
      openSelectedGuide(gid)
      // reset collapsed steps tracker in A2J_Tabs
      // TODO: handle this in Pages tab refactor
      window.collapsedSteps = []
    },

    '{window} author:guide-deleted': function (window, evt, guideId) {
      this.viewModel.deleteInterview(guideId)
    }
  }
})

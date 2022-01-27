import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import Guide from 'a2jauthor/src/models/guide'
import template from './interviews.stache'

const ObservableProxy = DefineMap.extend('ObservableProxy', {
  obj: {},
  key: {},
  value: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.obj[this.key] = val
        resolve(val)
      })
      resolve(this.obj[this.key])
    }
  }
})

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

  interviews: { /* all rows/records from CAJA_WS listGuides() api, meta data about the actual interviews */
    value ({ lastSet, listenTo, resolve }) {
      this.interviewsPromise.then((interviews) => {

        // TODO: remove this test line when the 'folder' column is reutrned from listGuides() API
        interviews.forEach(f => (f.folder = ['', 'foo', 'bar', 'Test Folder', 'test/folder/path', 'just a string'][~~(Math.random() * 6)]))

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

  isUnsorted (path) {
    return !path
  },
  newObservableBool (tf = false) {
    return new DefineMap({ value: tf })
  },
  toggleBool (observableBool) {
    observableBool.value = !observableBool.value
  },

  // bound and passed to folder-picker as the savedCallback param
  forceFolderUpdate (observableBool) {
    observableBool.value = false // close this folder-picker
    this.ownedInterviewsByFolder = this.interviews // force ownedInterviewsByFolder to recalc
  },

  // folders = [ { path: 'foobar', ls: [] }, ... ]
  // TODO: this is done, the CAJA_WS listGuides() api just needs to return the "folder" property along with the rest of the meta data
  ownedInterviewsByFolder: {
    value ({ lastSet, listenTo, resolve }) {
      const resolver = interviews => {
        if (interviews && interviews.value && interviews.value.length) {
          interviews = interviews.value // old can model weirdness?
        }
        const folders = new DefineList()
        const folderMap = {}
        const ownedList = (interviews && interviews.owned && interviews.owned()) || []
        ownedList.forEach(i => {
          const path = i.folder || '' // guideListRow.folder is just a string
          const folderMeta = folderMap[path] = (folderMap[path] || new DefineMap())
          if (!folderMeta.ls) {
            folderMeta.path = path
            folderMeta.ls = new DefineList()
            folders.push(folderMeta)
          }
          folderMeta.ls.push(i)
        })
        resolve(folders)
      }
      listenTo('interviews', resolver)
      listenTo('interviews.lenth', () => resolver(this.interviews))
      listenTo(lastSet, resolver)
      resolver([])
    }
  },

  newObservableProxy (obj, key) {
    return new ObservableProxy({ obj, key })
  },
  folderPopoverTitle (interviewTitle) {
    let title = interviewTitle || ''
    if (title.length > 53) {
      title = title.substr(0, 50) + '...'
    }
    return `Move Interview "${title}" into folder`
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

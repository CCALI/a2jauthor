import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './publish-tab.stache'

const LHICallback = function (data) {
  window.setProgress('')
  window.gGuideID = data.gid
  if (data.url !== '') {
    window.open(data.url)
  }
}

const A2JOrgCallback = function (data) {
  window.setProgress('')
  window.gGuideID = data.gid
  if (data.url !== '') {
    window.can.route.data.page = 'a2jorg'
  }
}

const publishFunctionMap = {
  'guidezip': {
    message: 'Generating ZIP',
    callback: function (data) {
      window.setProgress('')
      window.gGuideID = data.gid

      if (data.zip !== '') {
        window.open(data.zip)
      }
    }
  },
  'guideZIPA2JLOCAL': {
    message: 'Publishing to a2j.org local DEV',
    callback: A2JOrgCallback
  },
  'guideZIPA2JDEV': {
    message: 'Publishing to A2J.org DEV',
    callback: A2JOrgCallback
  },
  'guideZIPA2JSTAGE': {
    message: 'Publishing to staging.A2J.org',
    callback: A2JOrgCallback
  },
  'guideZIPA2JPROD': {
    message: 'Publishing to www.A2J.org',
    callback: A2JOrgCallback
  },
  'guideZIPLHI': {
    message: 'Publishing to LHI',
    callback: LHICallback,
    server: 'QA'
  },
  'guideZIPLHIQA': {
    message: 'Publishing to LHI - QA',
    callback: LHICallback,
    server: 'QA'
  },
  'guideZIPLHIDEV': {
    message: 'Publishing to LHI DEV',
    callback: LHICallback,
    server: 'QA'
  },
  'guideZIPMARLABS': {
    message: 'Publishing to Marlabs DEV',
    callback: LHICallback,
    server: 'QA'
  }
}

export const PublishTabVM = DefineMap.extend('PublishTabVM', {
  // passed in via app.stache
  guide: {},
  guideId: {},
  previewInterview: {}, // current viewer interview. Current answers in the preview (if any) are stored on .attr('answers')

  waiting: {
    type: 'boolean',
    default: false
  },

  sendPublishCommand (cmd) {
    this.waiting = true
    const publishedVersion = Date.now() + ''
    this.guide.publishedVersion = publishedVersion
    if (this.previewInterview) {
      this.previewInterview.attr('publishedVersion', publishedVersion)
    }
    if (window.gGuide) {
      window.gGuide.publishedVersion = publishedVersion
    }

    return this.guideSave().done(() => {
      const message = publishFunctionMap[cmd].message
      const targetServer = publishFunctionMap[cmd].server
      const wsCallback = publishFunctionMap[cmd].callback
      if (message) {
        window.setProgress(message, true)
      }

      const options = {
        cmd,
        gid: this.guideId
      }

      if (targetServer) {
        options.server = targetServer
      }

      return this.ws(options, wsCallback).done(() => { this.waiting = false })
    })
  },

  ws (data, results) { // duplicate of window.ws, modified with return value
    const errorHandler = (err, xhr) => {
      console.error('ws error', err)
      window.dialogAlert({ title: 'Error loading file', body: xhr.responseText })
      window.setProgress('Error: ' + xhr.responseText)
    }

    return $.ajax({
      url: 'CAJA_WS.php',
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function (data) {
        results(data)
      },
      error: errorHandler
    })
  },

  // TODO: when everything is refactored/updated, this should be on guide.save()
  // duplicate of the window.guideSave(), modified with a return value
  guideSave (onFinished) {
    const gGuide = this.guide
    const gGuideID = this.guideId

    if (gGuide !== null && gGuideID !== 0) {
      var xml = window.exportXML_CAJA_from_CAJA(gGuide)

      window.setProgress('Saving ' + gGuide.title, true)

      if (xml !== gGuide.lastSaveXML) {
        gGuide.lastSaveXML = xml

        // 01/14/2015 included JSON form of guide XML
        var guideJSONstr = window.guide2JSON_Mobile(gGuide)

        var params = {
          cmd: 'guidesave',
          gid: gGuideID,
          guide: xml,
          title: gGuide.title,
          json: guideJSONstr
        }
        return this.ws(params, function (response) {
          if (typeof onFinished === 'function') onFinished()

          if ((window.makestr(response.error) !== '')) {
            window.setProgress(response.error)
          } else {
            window.setProgress('Saved')
            $('#author-app').trigger('author:guide-updated')
          }
        })
      } else {
        window.setProgress('No changes since last save')
        if (typeof onFinished === 'function') onFinished()
      }
    }
  }
})

export default Component.extend({
  tag: 'publish-tab',
  view: template,
  leakScope: false,
  ViewModel: PublishTabVM
})

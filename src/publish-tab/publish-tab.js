import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './publish-tab.stache'

const LHICallback = function guideZipped (data) {
  window.setProgress('')
  window.gGuideID = data.gid
  if (data.url !== '') {
    window.open(data.url)
  }
}

const A2JOrgCallback = function guideZipped (data) {
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
  guide: {
    set (guide) {
      console.log('setting guide', guide)
      return guide
    }
  },
  guideId: {},

  sendPublishCommand (cmd) {
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

    if (targetServer) { options.server = targetServer }

    window.ws(options, wsCallback)
  },

  ws (data, results) { // duplicate of window.ws
    const errorHandler = (err, xhr) => {
      console.error('ws error', err)
      window.dialogAlert({ title: 'Error loading file', body: xhr.responseText })
      window.setProgress('Error: ' + xhr.responseText)
    }

    $.ajax({
      url: 'CAJA_WS.php',
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function (data) {
        results(data)
      },
      error: errorHandler
    })
  }
})

export default Component.extend({
  tag: 'publish-tab',
  view: template,
  leakScope: false,
  ViewModel: PublishTabVM
})

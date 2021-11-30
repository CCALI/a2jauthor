import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './publish-tab.stache'

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
    window.setProgress('Generating ZIP', true)

    window.ws({ cmd, gid: this.guideId }, function (data) {
      window.setProgress('')
      window.gGuideID = data.gid

      if (data.zip !== '') {
        window.open(data.zip)
      }
    })
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
        // trace(String.substr(JSON.stringify(data),0,299));
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

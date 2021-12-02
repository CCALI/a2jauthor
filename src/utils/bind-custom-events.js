import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import compute from 'can-compute'
import constants from '~/src/models/constants'

// This function sets some event handles for custom events used to communicate
// the parts of the author app that are outside of the scope of CanJS.
export default function bindCustomEvents (appState) {
  let $authorApp = $('#author-app')

  // user clicks the preview button in the edit page modal
  $authorApp.on('edit-page:preview', function (evt, pageName) {
    const previewInterview = appState.previewInterview
    const answers = previewInterview && previewInterview.attr('answers')
    if (answers) {
      // constants.js has PAGEHISTORY: 'A2J Visited Pages'
      const answer = answers[constants.PAGEHISTORY.toLowerCase()]
      answer && (answer.values = [null]) // this clears the visited pages history between individual previews
    }
    appState.previewPageName = pageName
    appState.page = 'preview'
    appState.previewMode = true
  })

  // internal parts of the code call `window.traceAlert` which no longer
  // updates the DOM manually but triggers this event
  $authorApp.on('author:trace-alert', function (evt, data) {
    let alertMessages = appState.viewerAlertMessages
    let guideId = alertMessages.attr('guideId')

    // we set a static `guideId` property to the alertMessages list to avoid
    // mixing alert messages from different interviews when the selected
    // interview changes.
    if (!guideId || (guideId && guideId !== data.guideId)) {
      alertMessages.replace([])
      alertMessages.attr('guideId', data.guideId)
    }

    alertMessages.push({ message: data.message, open: true })
  })

  // user double clicks a guide in the interview tab or clicks the open guide
  // button in the toolbar.
  $authorApp.on('author:item-selected', function (evt, guideId) {
    let alertMessages = appState.viewerAlertMessages

    // this check is similar to the one made in the `author:trace-alert`,
    // *this* covers the case where a selected interview does not generate
    // alert messages (which causes `author:trace-alert` to not fire at all)
    if (guideId !== alertMessages.attr('guideId')) {
      alertMessages.replace([])
      alertMessages.attr('guideId', guideId)
    }
    // this is work around for binding error in can-map
    const gGuideMapData = {}
    Object.keys(window.gGuide).forEach((key) => {
      gGuideMapData[key] = window.gGuide[key]
    })
    const gGuideMap = new DefineMap(gGuideMapData)

    appState.guideId = guideId
    appState.guidePath = window.gGuidePath
    appState.guide = gGuideMap
  })

  // when window.gGuide is saved to the server successfully,
  // sync the map reference in the appState.
  $authorApp.on('author:guide-updated', function () {
    // this is work around for binding error in can-map
    const gGuideMapData = {}
    Object.keys(window.gGuide).forEach((key) => {
      gGuideMapData[key] = window.gGuide[key]
    })
    const gGuideMap = new DefineMap(gGuideMapData)
    appState.guide = gGuideMap
  })

  // Updates legacy global window.gGuide with changes to CanJS guide.vars
  var serializedGuideVars = compute(function () {
    var guideVars = appState.guide && appState.guide.vars
    if (guideVars) {
      return guideVars.serialize()
    }
  })
  serializedGuideVars.on('change', function (ev, newVars) {
    if (newVars) {
      window.gGuide.vars = newVars
    }
  })
}

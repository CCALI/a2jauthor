import $ from 'jquery'
import CanMap from 'can-map'
import _includes from 'lodash/includes'
import constants from 'caja/viewer/models/constants'
import compute from 'can-compute'

// List of field types that can be filled with the `sample` property.
const canUseSampleValues = [
  constants.ftText, constants.ftTextLong,
  constants.ftTextPick, constants.ftNumber,
  constants.ftNumberDollar, constants.ftNumberSSN,
  constants.ftNumberPhone, constants.ftNumberZIP,
  constants.ftNumberPick, constants.ftDateMDY
]

// This function sets some event handles for custom events used to communicate
// the parts of the author app that are outside of the scope of CanJS.
export default function bindCustomEvents (appState) {
  let $authorApp = $('#author-app')

  // user clicks the preview button in the edit page modal
  $authorApp.on('edit-page:preview', function (evt, pageName) {
    appState.attr('previewPageName', pageName)
    appState.attr('page', 'preview')
    appState.attr('previewMode', true)
  })

  // internal parts of the code call `window.traceAlert` which no longer
  // updates the DOM manually but triggers this event
  $authorApp.on('author:trace-alert', function (evt, data) {
    let alertMessages = appState.attr('viewerAlertMessages')
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
    let alertMessages = appState.attr('viewerAlertMessages')

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
    const gGuideMap = new CanMap(gGuideMapData)

    appState.attr({
      guideId: guideId,
      guidePath: window.gGuidePath,
      guide: gGuideMap
    })
  })

  // when window.gGuide is saved to the server successfully,
  // sync the map reference in the appState.
  $authorApp.on('author:guide-updated', function () {
    // this is work around for binding error in can-map
    const gGuideMapData = {}
    Object.keys(window.gGuide).forEach((key) => {
      gGuideMapData[key] = window.gGuide[key]
    })
    const gGuideMap = new CanMap(gGuideMapData)
    appState.attr('guide', gGuideMap)
  })

  // TODO: Figure out a better way to do this.
  $authorApp.on('author:fill-page-sample', function () {
    let $fields = $('a2j-fields')

    // do nothing if `a2j-fields` component not in the DOM.
    if (!$fields.length) return

    let pageFields = $fields[0].viewModel.attr('fields')

    pageFields.forEach(function (field) {
      let answer = field.attr('_answer')
      let fieldType = field.attr('type')
      let sampleValue = field.attr('sample')

      if (_includes(canUseSampleValues, fieldType)) {
        field.attr('hasError', false)
        answer.attr('values', sampleValue)
      }
    })
  })

  // Updates legacy window.gGuide with changes to canjs guide.vars
  var vars = compute(function () {
    var vars = appState.attr('guide.vars')
    if (vars) {
      return vars.serialize()
    }
  })
  vars.on('change', function (ev, newVars) {
    if (newVars) {
      window.gGuide.vars = newVars
    }
  })
}

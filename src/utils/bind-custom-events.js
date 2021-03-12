import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import _includes from 'lodash/includes'
import constants from '~/src/models/constants'
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

  // TODO: Figure out a better way to do this.
  $authorApp.on('author:fill-page-sample', function () {
    // let $fieldsNodesList = $('a2j-fields')

    let $fieldsNodesList = $('a2j-field')

    // do nothing if `a2j-fields` component not in the DOM.

    if (!$fieldsNodesList.length) return

    let fieldVM

    $fieldsNodesList.each(function (index, fieldEl) {
      fieldVM = fieldEl.viewModel

      let field = fieldVM.field
      console.log(field, 'sadml')
      let answerVm = field._answerVm
      let fieldType = field.type
      let sampleValue = field.sample

      // iterate over datepicker elements

      // if (fieldType === 'datemdy') {
      //   fieldEl.querySelector('input').value = sampleValue
      //   fieldVM.validateField(null, fieldEl)
      // }

      if (_includes(canUseSampleValues, fieldType)) {
        field.hasError = false
        answerVm.values = sampleValue
      }
    })
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

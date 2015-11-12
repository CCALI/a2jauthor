import $ from 'jquery';
import constants from 'viewer/models/constants';
import _contains from 'lodash/collection/contains';

// List of field types that can be filled with the `sample` property.
const canUseSampleValues = [
  constants.ftText, constants.ftTextLong,
  constants.ftTextPick, constants.ftNumber,
  constants.ftNumberDollar, constants.ftNumberSSN,
  constants.ftNumberPhone, constants.ftNumberZIP,
  constants.ftNumberPick, constants.ftDateMDY
];

// This function sets some event handles for custom events used to communicate
// the parts of the author app that are outside of the scope of CanJS.
export default function bindCustomEvents(appState) {
  let $authorApp = $('#author-app');

  // user clicks the preview button in the edit page modal
  $authorApp.on('edit-page:preview', function(evt, pageName) {
    appState.attr('previewPageName', pageName);
    appState.attr('page', 'preview');
    appState.attr('previewMode', true);
  });

  // internal parts of the code call `window.traceAlert` which no longer
  // updates the DOM manually but triggers this event
  $authorApp.on('author:trace-alert', function(evt, alert) {
    appState.attr('viewerAlertMessages').push({message: alert, open: true});
  });

  // user double clicks a guide in the interview tab or clicks the open guide
  // button in the toolbar.
  $authorApp.on('author:guide-selected', function(evt, guideId) {
    appState.attr('viewerAlertMessages').replace([]);
    appState.attr('guideId', guideId);
  });

  // TODO: Figure out a better way to do this.
  $authorApp.on('author:fill-page-sample', function() {
    let $fields = $('a2j-fields');

    // do nothing if `a2j-fields` component not in the DOM.
    if (!$fields.length) return;

    let pageFields = $fields.viewModel().attr('fields');

    pageFields.each(function(field) {
      let answer = field.attr('_answer');
      let fieldType = field.attr('type');
      let sampleValue = field.attr('sample');

      if (_contains(canUseSampleValues, fieldType)) {
        field.attr('hasError', false);
        answer.attr('values', sampleValue);
      }
    });
  });
};

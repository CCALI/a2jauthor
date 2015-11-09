import $ from 'jquery';

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
    appState.attr('viewerAlertMessages').push(alert);
  });

  // user double clicks a guide in the interview tab or clicks the open guide
  // button in the toolbar.
  $authorApp.on('author:guide-selected', function(evt, guideId) {
    appState.attr('viewerAlertMessages').replace([]);
    appState.attr('guideId', guideId);
  });
};

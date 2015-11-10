import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './debug-panel.stache!';

const DebugPanelVM = Map.extend({});

export default Component.extend({
  template,
  viewModel: DebugPanelVM,
  tag: 'author-debug-panel',

  events: {
    inserted() {
      window.A2JViewer.refreshVariables();

      // set up jquery-ui buttons.
      $('#downloadAnswer').button({
        label: 'Save',
        icons: {primary:'ui-icon-disk'}
      });

      $('#refreshAnswer').button({
        label: 'Refresh',
        icons: {primary:'ui-icon-arrowrefresh-1-w'}
      });

      $('#clearAnswer').button({
        label: 'Clear',
        icons: {primary:'ui-icon-trash'}
      });

      $('#clearTrace').button({
        label: 'Clear',
        icons: {primary:'ui-icon-trash'}
      });

      $('#uploadAnswer').button({
        label: 'Open',
        icons: {primary:'ui-icon-folder-open'}
      });
    },

    // Download answer file directly from client to desktop.
    '#downloadAnswer click': function() {
      let hotDocsXML = window.gGuide.HotDocsAnswerSetXML();
      window.downloadTextFile(hotDocsXML, 'answer.anx');
    },

    '#refreshAnswer click': function() {
      window.A2JViewer.refreshVariables();
    },

    '#clearAnswer click': function() {
      window.gGuide.varClearAll();
      window.A2JViewer.refreshVariables();
    },

    '#clearTrace click': function() {
      $('#tracer').empty();
    },

    '#viewer-var-filter keyup': function() {
      window.A2JViewer.filterVariables();
    },

    // Browse for answer file on local desktop to upload to client (no server).
    '#uploadAnswerFileInput change': function() {
      var textType = /text.*/;
      let file = $('#uploadAnswerFileInput')[0].files[0];

      window.setProgress('Loading...');

      if (file.type === '' || file.type.match(textType)) {
        let reader = new FileReader();

        reader.onload = function(e) {
          var data = $.parseXML(reader.result);
          window.gGuide.HotDocsAnswerSetFromXML($(data));
          window.setProgress('');
          window.A2JViewer.refreshVariables();
        };

        reader.readAsText(file);
      } else {
        window.setProgress('File not supported!');
      }
    }
  }
})

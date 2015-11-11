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

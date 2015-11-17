import $ from 'jquery';
import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import template from './debug-panel.stache!';
import parser from 'viewer/mobile/util/parser';

import 'can/map/define/';

const DebugPanelVM = Map.extend({
  define: {
    variables: {
      get() {
        let interview = this.attr('interview');

        return interview
          ? interview.attr('variablesList')
          : new List([]);
      }
    }
  },

  clearAnswers() {
    let interview = this.attr('interview');

    if (interview) {
      interview.clearAnswers();
    }
  }
});

export default Component.extend({
  template,
  viewModel: DebugPanelVM,
  tag: 'author-debug-panel',

  events: {
    // Download answer file directly from client to desktop.
    '#downloadAnswer click': function() {
      let interview = this.viewModel.attr('interview');
      let answers = interview.attr('answers').attr();
      let pages = interview.attr('_pages').attr();

      let hotDocsXML = parser.parseANX(answers, pages);
      window.downloadTextFile(hotDocsXML, 'answer.anx');
    },

    '#clearTrace click': function() {
      this.element.find('#tracer').empty();
    },

    '#viewer-var-filter keyup': function() {
      let $input = this.element.find('#viewer-var-filter');
      let filter = $input.val().toLowerCase();

      this.element.find('tbody tr').each(function() {
        let $row = $(this);
        let rowText = $row.text().toLowerCase();
        $row.toggle(rowText.indexOf(filter) !== -1);
      });
    },

    // Browse for answer file on local desktop to upload to client (no server).
    '#uploadAnswerFileInput change': function() {
      let textTypeRegex = /text.*/;
      let interview = this.viewModel.attr('interview');
      let $fileInput = this.element.find('#uploadAnswerFileInput');

      let file = $fileInput.get(0).files[0];
      let vars = interview.attr('vars').attr();

      if (file.type === '' || file.type.match(textTypeRegex)) {
        let reader = new FileReader();

        reader.onload = e => {
          let answers = parser.parseJSON(reader.result, vars);
          interview.attr('answers', answers);
        };

        reader.readAsText(file);
      }
    }
  }
})

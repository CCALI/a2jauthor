import Map from 'can/map/';
import Component from 'can/component/';
import template from './variables.stache!';
import parser from 'viewer/mobile/util/parser';
import cString from 'viewer/mobile/util/string';

let VariablesTableVM = Map.extend({
  clearAnswers() {
    let interview = this.attr('interview');

    if (interview) {
      interview.clearAnswers();
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  viewModel: VariablesTableVM,
  tag: 'author-variables-table',

  events: {
    // Download answer file directly from client to desktop.
    '#downloadAnswer click': function() {
      const interview = this.viewModel.attr('interview');
      const pages = interview.attr('_pages').serialize();
      const answers = interview.attr('answers').serialize();

      const hotDocsXML = parser.parseANX(answers, pages);
      window.downloadTextFile(hotDocsXML, 'answer.anx');
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

        reader.onload = () => {
          const answers = parser.parseJSON(reader.result, vars);

          // Saved answers for LHI HotDocs uses british style dates dd/mm/yyyy
          // convert those back to US dates mm/dd/yyyy
          Object.keys(answers).forEach(findDateType);

          function findDateType(answer) {
            if (answers[answer].type === 'Date') {
              let values = answers[answer].values;
              values.forEach(convertToUSDate);
            }
          }

          function convertToUSDate(britDate, index, valuesArray) {
            if (britDate) {
              let usDate = cString.swapMonthAndDay(britDate);
              valuesArray[index] = usDate;
            }
          }

          interview.attr('answers', answers);
        };

        reader.readAsText(file);
      }
    }
  }
});

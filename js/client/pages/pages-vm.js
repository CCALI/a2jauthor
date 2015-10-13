import Map from 'can/map/';

export default Map.extend({
  currentPage: null,

  _setPage: function(page, gotoPage) {
    let rState = this.attr('rState');
    let answer = this.attr('interview.answers.' + page.attr('repeatVar'));
    let i = answer ? new AnswerVM({ answer: answer }).attr('values') : null;

    if (i) {
      rState.attr({
        page: gotoPage,
        i: +i
      });
    } else {
      rState.removeAttr('i');
      rState.attr('page', gotoPage);
    }
  },

  home: function() {
    this.attr('rState').attr({}, true);
  },

  navigate: function(button) {
    let error = false;
    let fields = this.attr('currentPage.fields');

    can.each(fields, function(field) {
      let errors = field.attr('_answer').errors();
      field.attr('hasError', !!errors);

      if (errors) error = true;
    });

    if (!error) {
      let logic = this.attr('logic');

      logic.exec(this.attr('currentPage.codeAfter'));

      let gotoPage = logic.attr('gotoPage');
      if (gotoPage && gotoPage.length) {
        logic.attr('gotoPage', null);
        this._setPage(this.attr('currentPage'), gotoPage);
      }
      else if (button.next === 'SUCCESS') {
        let self = this;
        let completed = new AnswerVM({
          answer: this.attr('pState.answers.' + constants.vnInterviewIncompleteTF.toLowerCase())
        });

        completed.attr('values', false);
        var dfd = this.attr('pState').save();
        dfd.done(function(url) {
          self.attr('mState').attr({
            redirect: url,
            header: '',
            step: ''
          });
          self.attr('rState').attr({ view: 'complete' }, true);
        });
      }
      else {
        this._setPage(this.attr('currentPage'), button.next);
      }
    }
  }
});

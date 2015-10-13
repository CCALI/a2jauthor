import Model from 'can/model/';
import Parser from 'client/util/parser';
import Answers from 'client/models/answers';
import LocalModel from 'client/models/local-model';

import 'can/map/define/';
import 'client/util/backup';
import 'can/construct/super/';

export default Model.extend({
  findOne: function() {
    return new can.Deferred().resolve({});
  }
}, {

  define: {
    answers: {
      Value: Answers,
      Type: Answers
    },

    visited: {
      value: {}
    }
  },

  init: function() {
    this.backup();
  },

  save: function(autosave) {
    let self = this;
    let dfd = new can.Deferred();

    //parse and send xml to server
    var anx = Parser.parseANX(self.serialize().answers);

    if (!autosave) {
      // Post as AnswerKey variable.
      // 03/05/2015 SJG POST replaces this page (like A2J 4)
      // Eventually we should use AJAX and then redirect when successfully uploaded.
      var $form = $('<form action="' + this.attr('setDataURL') + '" method=POST accept-charset="UTF-8" target=_parent><input type=hidden id="AnswerKey" name="AnswerKey"/></form>');
      $('body').append($form);
      $('#AnswerKey').val(anx);
      $form.submit();
    }

    can.ajax({
      url: autosave ? this.attr('autoSetDataURL') : this.attr('setDataURL'),
      type: 'POST',
      data: {
        AnswerKey: anx
      },
      success: function(msg) {
        self.backup();
        dfd.resolve(msg);
      },

      error: function() {
        dfd.reject();
      }
    });

    return dfd;
  }
});

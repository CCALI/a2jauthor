import Model from 'can/model/';
import Page from 'client/models/page';
import parser from 'client/util/parser';
import _find from 'lodash/collection/find';
import Answers from 'client/models/answers';

import 'can/map/define/';

export default can.Model.extend({
  findOne: function(data, success, error) {
    let dfd = new can.Deferred();
    let resumeDfd = new can.Deferred();

    let interviewDfd = can.ajax({
      url: data.url
    });

    interviewDfd.done(function(interview) {
      if (data.resume) {
        can.ajax({
          url: data.resume,
          dataType: 'text'
        })
        .done(function(anx) {
          var vars = parser.parseJSON(anx, interview.vars);
          interview.vars = vars;

          resumeDfd.resolve(interview);
        })
        .fail(function() {
          resumeDfd.reject();
        });
      } else {
        resumeDfd.resolve(interview);
      }
    });

    resumeDfd.done(function(interview) {
      dfd.resolve(interview);
    }).fail(function() {
      dfd.reject();
    });

    return dfd;
  },

  parseModel: function(data) {
    data._pages = data.pages;
    data.pages = [];

    can.each(data._pages, function(p) {
      let num = p.step;

      let step = _find(data.steps, function(step) {
        return +step.number === num;
      });

      p.step = step;

      data.pages.push(p);
    });

    can.each(data.vars, function(v) {
      v.values = v.values || [null];
    });

    return data;
  }
}, {
  define: {
    pages: {
      set: function(list) {
        list.forEach(p => p.interview = this);
        var pages = new Page.List(list);
        return pages;
      },

      Type: Page.List
    },

    answers: {
      Type: Answers,
      Value: Answers
    }
  },

  createGuide: function() {
    var answers = this.attr('answers');

    return {
      pages: this._pages,
      varExists: can.proxy(answers.varExists, answers),
      varGet: can.proxy(answers.varGet, answers),
      varSet: can.proxy(answers.varSet, answers)
    };
  }
});

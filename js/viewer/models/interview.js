import Model from 'can/model/';
import Page from 'viewer/models/page';
import _find from 'lodash/collection/find';
import _extend from 'lodash/object/extend';
import Answers from 'viewer/models/answers';
import _isString from 'lodash/lang/isString';
import parser from 'viewer/mobile/util/parser';
import _includes from 'lodash/collection/includes'
import getSkinTone from 'viewer/models/get-skin-tone';

import 'can/map/define/';

export default can.Model.extend({
  findOne: function(data, success, error) {
    let dfd = can.Deferred();
    let resumeDfd = can.Deferred();

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
      let page = _extend({}, p);
      let stepNumber = page.step;

      let step = _find(data.steps, function(step) {
        return parseInt(step.number, 10) === stepNumber;
      });

      // put the actual step object in the page.
      page.step = step;
      data.pages.push(page);
    });

    can.each(data.vars, function(v) {
      v.values = v.values || [null];
    });

    return data;
  }
}, {
  define: {
    answers: {
      Type: Answers,
      Value: Answers
    },

    pages: {
      set: function(list) {
        list.forEach(p => p.interview = this);
        var pages = new Page.List(list);
        return pages;
      },

      Type: Page.List
    },

    steps: {
      get(steps) {
        let pages = this.attr('pages');
        let withPages = pages.map(p => p.attr('step.number')).attr();
        return steps.filter(s => _includes(withPages, s.attr('number')));
      }
    },

    guideAvatarGender: {
      serialize: false,
      get() {
        let gender = this.attr('guideGender') || '';
        return gender.toLowerCase() === 'male'
          ? 'male'
          : 'female';
      }
    },

    avatarSkinTone: {
      serialize: false,
      get() {
        let varName = this.attr('avatar');
        return getSkinTone(varName);
      }
    },

    userGender: {
      serialize: false,
      get() {
        let result;
        let answers = this.attr('answers');
        let gender = answers.attr('user gender');

        if (gender) {
          let values = gender.attr('values').attr() || [];
          let lastValue = values.pop();

          if (_isString(lastValue) && lastValue.length) {
            lastValue = lastValue.toLowerCase();

            switch (lastValue) {
              case 'm':
              case 'male':
                result = 'male';
                break;

              case 'f':
              case 'female':
                result = 'female';
                break;
            }
          }
        }

        return result;
      }
    }
  },

  createGuide() {
    var answers = this.attr('answers');

    return {
      pages: this._pages,
      varExists: can.proxy(answers.varExists, answers),
      varGet: can.proxy(answers.varGet, answers),
      varSet: can.proxy(answers.varSet, answers)
    };
  },

  getPageByName(name) {
    let pages = this.attr('pages');

    return _find(pages, function(page) {
      return page.attr('name') === name;
    });
  }
});

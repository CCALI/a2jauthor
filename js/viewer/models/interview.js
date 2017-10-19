import List from 'can/list/';
import Model from 'can/model/';
import _last from 'lodash/last';
import _keys from 'lodash/keys';
import _find from 'lodash/find';
import _assign from 'lodash/assign';
import Page from 'viewer/models/page';
import _includes from 'lodash/includes';
import _isString from 'lodash/isString';
import Answers from 'viewer/models/answers';
import parser from 'viewer/mobile/util/parser';
import {Hair, Skin} from 'viewer/desktop/avatar/colors';

import 'can/list/sort/';
import 'can/map/define/';
import 'can/util/batch/';

/**
 * @module {function} Interview
 * @inherits can.Model
 * @parent api-models
 *
 * The **Interview** model represents a sample interview or an interview created
 * by the logged in user.
 *
 *  @codestart
 *    Interview
 *      .findOne({ url: 'path/to/interview' })
 *      .then(function(interview) {});
 *  @codeend
 *
 */

function getInterviewPath(url) {
  if (_isString(url) && url.length) {
    let parts = url.split('/');

    // drop the interview filename
    parts.pop();

    return `${parts.join('/')}/`;
  }
}

const Interview = Model.extend({
  findOne(data, success, error) {
    let dfd = can.Deferred();
    let resumeDfd = can.Deferred();
    let interviewPath = getInterviewPath(data.url);

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
      dfd.resolve(_assign({interviewPath}, interview));
    });

    resumeDfd.fail(function() {
      dfd.reject();
    });

    return dfd.then(success, error);
  },

  parseModel(data) {
    data.steps = data.steps || [];
    data._pages = data.pages;
    data.pages = [];

    can.each(data._pages, function(p) {
      const page = _assign({}, p);
      const step = data.steps[page.step];

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

      value() {
        return new Answers();
      }
    },

    pages: {
      Type: Page.List
    },

    steps: {
      get(steps) {
        const pages = this.attr('pages');

        // This is an array of step numbers which have pages associated to them
        const stepsNumbers = pages.map(p => p.attr('step.number')).attr();

        // Filters all the steps that own pages.
        return steps.filter(s => _includes(stepsNumbers, s.attr('number')));
      }
    },

    guideAvatarGender: {
      serialize: false,
      value: 'female',
      get() {
        let gender = this.attr('guideGender') || '';
        return gender.toLowerCase() === 'male' ? 'male' : 'female';
      }
    },

    avatarSkinTone: {
      type: Skin,
      value: Skin.defaultValue
    },

    avatarHairColor: {
      type: Hair,
      value: Hair.defaultValue
    },

    /**
     * @property {String} Guide.prototype.interviewPath interviewPath
     *
     * The path of the interview in the server; when the viewer is running
     * standalone we get the path from the url used to retrieve the interview,
     * in this case the property is set in `Interview.findOne`. When running
     * in preview mode (author app), we get the path from a global variable;
     * this path is used to during the normalization of the path of some custom
     * images provided by the author (like `logoImage`, or `endImage`).
     */
    interviewPath: {
      serialize: false,
      get(path) {
        return window.gGuidePath ? window.gGuidePath : path;
      }
    },

    userGender: {
      serialize: false,
      get() {
        let result;
        let answers = this.attr('answers');
        let gender = answers.attr(userGenderVarName);

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
    },

    /**
     * @property {List} Guide.prototype.variablesList variablesList
     *
     * Returns a list of the interview variables, the variables come from the
     * server in `interview.vars`, which is an object where each key is a var
     * name and its value is an object with the properties of a variable (name,
     * repeating, flag, value...), having an actual list is handy for rendering
     * purposes.
     *
     */
    variablesList: {
      serialize: false,

      get() {
        let list = new List();
        let answers = this.attr('answers');
        let vars = this.attr('vars').attr();

        // sort list using "natural string" sort.
        list.attr('comparator', function(a, b) {
          let aName = a.attr('name');
          let bName = b.attr('name');

          return aName.localeCompare(bName, {numeric: true});
        });

        _keys(vars).forEach(function(key) {
          let variable = vars[key];
          let answer = answers.attr(key.toLowerCase());

          let values = answer ? answer.attr('values').attr() : variable.values;

          if (!variable.repeating) {
            // handle [ null ] or [ null, "foo" ] scenarios
            list.push({
              value: _last(values),
              name: variable.name,
              repeating: null
            });
          } else if (values.length <= 1) {
            // repeating variable with no values ie. [ null ]
            list.push({
              value: null,
              name: variable.name,
              repeating: null
            });
          } else {
            // repeating variable with values
            values.forEach((item, i) => {
              if (item !== null) {
                list.push({
                  value: item,
                  name: variable.name,
                  repeating: i
                });
              }
            });
          }
        });

        return list;
      }
    }
  },

  clearAnswers() {
    // can.batch required for Author preview mode with long var/answer lists
    can.batch.start();

    this.attr('answers').each((answer) => {
      if (answer && answer.attr('values') && answer.attr('values').length > 1) {
        answer.attr('values', [null]);
      }
    });

    can.batch.stop();
  },

  createGuide() {
    var answers = this.attr('answers');

    return {
      pages: this._pages,
      varExists: can.proxy(answers.varExists, answers),
      varCreate: can.proxy(answers.varCreate, answers),
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

export default Interview;
export const userGenderVarName = 'user gender';

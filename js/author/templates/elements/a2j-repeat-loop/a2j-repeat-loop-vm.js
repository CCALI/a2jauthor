import Map from 'can/map/';
import List from 'can/list/';
import _last from 'lodash/array/last';
import _range from 'lodash/utility/range';
import _isString from 'lodash/lang/isString';

import 'can/map/define/';

const isTrue = function(value) {
  return _isString(value) ?
    value.toLowerCase() === 'true' :
    Boolean(value);
};

/**
 * @property {can.Map} repeatLoop.ViewModel
 * @parent author/templates/elements/a2j-repeat-loop/
 *
 * `<a2j-repeat-loop>`'s viewModel.
 */
export default Map.extend({
  define: {
    /**
     * @property {Boolean} repeatLoop.ViewModel.prototype.editEnabled editEnabled
     * @parent repeatLoop.ViewModel
     *
     * Whether the component's edit options are enabled or not.
     */
    editEnabled: {
      type: 'boolean'
    },

    /**
     * @property {Number} repeatLoop.ViewModel.prototype.loopCounter loopCounter
     * @parent repeatLoop.ViewModel
     *
     * The number of times some static content will be repeated over; the author
     * can use this option to generate some static content [loopCounter] times
     * instead of iterating over an existing variable.
     */
    loopCounter: {
      value: 1
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.loopCounter loopCounter
     * @parent repeatLoop.ViewModel
     *
     * Name of the variable used to know how many times to iterate over the
     * variables used inside the table/list.
     *
     * An interview answers file has no nested collections, meaning, there are no
     * array of objects that might represent entities like: children or addresses,
     * instead each field of the entity inside a "collection" live in its own
     * variable, e.g:
     *
     * "Witness address state TE": ["IL", "IL", "IA"]
     * "Witness address zip TE": ["60661", "12345", "12347"]
     * "Witness apt number TE": ["#1B", "401", "BAR"]
     * "WitnessCount": 3
     *
     * The variables above represent a collection of witness addresses, unfortunately
     * there is no way to figure that out from the data structure, it's up to the
     * user to pick the variables that belong to a "logical collection".
     *
     * From the example above, "WitnessCount" is the variable that indicates how
     * many elements the collection has, that's the string we'd store in
     * [loopVariable].
     */
    loopVariable: {
      value: ''
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.displayType displayType
     * @parent repeatLoop.ViewModel
     *
     * Whether to render the collection variables in a `table`, `list` or `text`.
     */
    displayType: {
      value: 'table'
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.loopType loopType
     * @parent repeatLoop.ViewModel
     *
     * Whether to use [loopCounter] to repeat the content several times or
     * to use a variable name to loop over 'repeating' variables.
     */
    loopType: {
      value: 'counter',
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.loopType loopType
     * @parent repeatLoop.ViewModel
     *
     * The title shown at the top of the component's content.
     */
    loopTitle: {
      value: 'This is the loop title'
    },

    /**
     * @property {can.List} repeatLoop.ViewModel.prototype.tableColumns tableColumns
     * @parent repeatLoop.ViewModel
     *
     * This list holds the data used to render a html table.
     */
    tableColumns: {
      value() {
        return new List([{
          width: 100,
          variable: '',
          column: 'Column 1'
        }]);
      }
    },

    /**
     * @property {Booelan} repeatLoop.ViewModel.prototype.useLoopCounter useLoopCounter
     * @parent repeatLoop.ViewModel
     *
     * Whether to use a static counter defined by the user or to use an existing
     * interview variable as the loop control.
     */
    useLoopCounter: {
      get() {
        let loopType = this.attr('loopType');
        return loopType === 'counter';
      }
    },

    /**
     * @property {can.List} repeatLoop.ViewModel.prototype.loopCollection loopCollection
     * @parent repeatLoop.ViewModel
     *
     * List of numbers progressing from `0` up to either `loopCounter` or
     * the value of the variable reference by `loopVariable`. E.g, if
     * `loopVariable`'s value in `answers` is `5` the return list would be
     * `[0, 1, 2, 3, 4]`.
     */
    loopCollection: {
      get() {
        let useCounter = this.attr('useLoopCounter');

        if (useCounter) {
          let counter = this.attr('loopCounter');
          return new List(_range(counter));
        } else {
          let varName = this.attr('loopVariable');
          return this.rangeFromVariable(varName);
        }
      }
    }
  },

  getAnswer(varName = '') {
    let answers = this.attr('answers');
    let answerKey = varName.toLowerCase();

    if (answers && answerKey) {
      return answers.attr(answerKey);
    }
  },

  rangeFromVariable(varName = '') {
    let counter = 0;
    let variable = this.getAnswer(varName);

    if (variable) {
      counter = _last(variable.attr('values').attr());
    }

    return new List(_range(counter));
  },

  getAnswerAtIndex(varName, index) {
    let variable = this.getAnswer(varName);

    if (variable) {
      let values = variable.attr('values');
      let repeating = variable.attr('repeating');

      values = values.filter(v => v != null);

      if (isTrue(repeating) && index != null) {
        return values.attr(index);
      } else {
        return _last(values.attr());
      }
    }
  }
});

import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
import _range from 'lodash/utility/range';
import template from './a2j-repeat-loop.stache!';
import displayTableTpl from './repeat-table.stache!';

import 'can/view/';
import 'can/map/define/';

can.view.preload('display-table-tpl', displayTableTpl);

/**
 * @module {Module} author/templates/elements/a2j-repeat-loop/ <a2j-repeat-loop>
 * @parent api-components
 *
 * This component allows the loop over `repeating` variables and create tables/
 * lists with those values.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-repeat-loop {state}="state" />
 * @codeend
 */

/**
 * @property {can.Map} repeatLoop.ViewModel
 * @parent author/templates/elements/a2j-repeat-loop/
 *
 * `<a2j-repeat-loop>`'s viewModel.
 */
let RepeatLoopVM = Map.extend({
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

    loopCollection: {
      get() {
        let counter = this.attr('loopCounter');
        return new List(_range(counter));
      }
    },

    useLoopCounter: {
      get() {
        let loopType = this.attr('loopType');
        return loopType === 'counter';
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-repeat-loop',
  viewModel: RepeatLoopVM,

  events: {
    'input[name="displayType"] change': function($el) {
      this.viewModel.attr('displayType', $el.val());
    }
  }
});

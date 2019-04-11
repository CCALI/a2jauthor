import CanMap from 'can-map'
import CanList from 'can-list'
import _last from 'lodash/last'
import _range from 'lodash/range'

import 'can-map-define'

/**
 * @property {can.Map} repeatLoop.ViewModel
 * @parent author/templates/elements/a2j-repeat-loop/
 *
 * `<a2j-repeat-loop>`'s viewModel.
 */
export default CanMap.extend({
  define: {
    // passed in via stache
    nodeId: {},
    variablesList: {},
    answers: {},
    cloneNode: {},
    useAnswers: {},
    deleteNode: {},
    updateNode: {},
    fontProperties: {},
    toggleEditActiveNode: {},
    /**
     * @property {Boolean} repeatLoop.ViewModel.prototype.editEnabled editEnabled
     * @parent repeatLoop.ViewModel
     *
     * Whether the component's edit options are enabled or not.
     */
    editEnabled: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} repeatLoop.ViewModel.prototype.editActive editActive
     * @parent repeatLoop.ViewModel
     *
     * Whether the component is currently selected.
     */
    editActive: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} repeatLoop.ViewModel.prototype.deleted deleted
     * @parent repeatLoop.ViewModel
     *
     * FIXME
     */
    deleted: {
      type: 'boolean',
      value: false
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
      value: 1,
      set (value) {
        return value < 1 ? 1 : value
      }
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
      value: 'counter'
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.loopTitle loopTitle
     * @parent repeatLoop.ViewModel
     *
     * The title shown at the top of the component's content.
     */
    loopTitle: {
      value: 'This is the loop title'
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.loopTitleTag loopTitleTag
     * @parent repeatLoop.ViewModel
     *
     * Control the size of the title shown at the top of the component's content.
     */
    loopTitleTag: {
      value: 'h3'
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.loopRichText loopRichText
     * @parent repeatLoop.ViewModel
     *
     * The content of the rich text editor used when [displayType] is set to
     * `text`.
     */
    loopRichText: {
      value: ''
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.tableStyle tableStyle
     * @parent repeatLoop.ViewModel
     *
     * Whether the table is `bordered`, `condensed` or has `striped` rows; these
     * are the avaiable table style options in bootstrap.
     */
    tableStyle: {
      value: 'bordered'
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.listStyleType listStyleType
     * @parent repeatLoop.ViewModel
     *
     * Specifies the appearance of a list item element, current supported values
     * are `disc`, `decimal`, `lower-alpha`, `upper-alpha`, `lower-roman` and
     * `upper-roman`. These are some of the values allowed for the `list-style-type`
     * css property.
     */
    listStyleType: {
      value: 'disc'
    },

    /**
     * @property {String} repeatLoop.ViewModel.prototype.ckeditorInstance ckeditorInstance
     * @parent repeatLoop.ViewModel
     *
     * Represents an editor instance.
     */
    ckeditorInstance: {
      type: '*'
    },

    /**
     * @property {can.List} repeatLoop.ViewModel.prototype.tableColumns tableColumns
     * @parent repeatLoop.ViewModel
     *
     * This list holds the data used to render a html table.
     */
    tableColumns: {
      value () {
        return new CanList([{
          width: 100,
          variable: '',
          column: 'Column 1'
        }])
      }
    },

    /**
     * @property {can.List} repeatLoop.ViewModel.prototype.repeatEachInOneList repeatEachInOneList
     * @parent repeatLoop.ViewModel
     *
     * Whether to repeat each of the items in [listItems] in one list or to
     * repeat the entire list ([listItems]) multiple times.
     */
    repeatEachInOneList: {
      value: true,
      type: 'boolean'
    },

    /**
     * @property {can.List} repeatLoop.ViewModel.prototype.listItems listItems
     * @parent repeatLoop.ViewModel
     *
     * This list holds the data used to render a html list.
     */
    listItems: {
      value () {
        return new CanList([{
          variable: '',
          item: 'Item 1'
        }])
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
      get () {
        let loopType = this.attr('loopType')
        return loopType === 'counter'
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
      get () {
        let useCounter = this.attr('useLoopCounter')

        if (useCounter) {
          let counter = this.attr('loopCounter')
          return new CanList(_range(counter))
        } else {
          let varName = this.attr('loopVariable')
          return this.rangeFromVariable(varName)
        }
      }
    }
  },

  addColumn () {
    let columns = this.attr('tableColumns')
    let newLength = columns.attr('length') + 1
    let colWidth = Math.floor(100 / newLength)

    columns.forEach(function (col) {
      col.attr('width', colWidth)
    })

    columns.push({
      variable: '',
      width: colWidth,
      column: `Column ${newLength}`
    })
  },

  removeColumn (index) {
    let columns = this.attr('tableColumns')
    let newLength = columns.attr('length') - 1
    let colWidth = Math.floor(100 / newLength)

    columns.forEach(function (col) {
      col.attr('width', colWidth)
    })

    columns.splice(index, 1)
  },

  addListItem () {
    let items = this.attr('listItems')
    let newLength = items.attr('length') + 1

    items.push({
      variable: '',
      item: `Item ${newLength}`
    })
  },

  removeListItem (index) {
    let items = this.attr('listItems')
    items.splice(index, 1)
  },

  getAnswer (varName = '') {
    let answers = this.attr('answers')
    let answerKey = varName.toLowerCase()

    if (answers && answerKey) {
      return answers.attr(answerKey)
    }
  },

  rangeFromVariable (varName = '') {
    let counter = 0
    let variable = this.getAnswer(varName)

    if (variable) {
      counter = _last(variable.attr('values').attr())
    }

    return new CanList(_range(counter))
  },

  updateLoopRichText () {
    let editor = this.attr('ckeditorInstance')

    if (editor) {
      this.attr('loopRichText', editor.getData())
    }
  },

  destroyEditorInstance () {
    let editor = this.attr('ckeditorInstance')

    if (editor) {
      editor.destroy()
      editor.removeAllListeners()
      this.attr('ckeditorInstance', null)
    }
  }
})

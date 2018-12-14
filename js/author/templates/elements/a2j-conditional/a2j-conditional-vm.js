import CanMap from 'can-map'
import _includes from 'lodash/includes'
import _isFunction from 'lodash/isFunction'
import Answers from 'caja/author/models/answers'
import A2JNode from 'caja/author/models/a2j-node'
import A2JTemplate from 'caja/author/models/a2j-template'
import evalAuthorCondition from 'caja/author/utils/eval-author-condition'

/**
 * @property {can.Map} conditional.ViewModel
 * @parent author/templates/elements/a2j-conditional/
 *
 * `<a2j-conditional>`'s viewModel.
 */
export default CanMap.extend("A2JConditionalVM", {
  define: {
    /**
     * @property {Answers} conditional.ViewModel.prototype.answers answers
     * @parent conditional.ViewModel
     *
     * Answers object available when user uploads an ANX file during document
     * assembly.
     */
    answers: {
      Type: Answers
    },

    /**
     * @property {Boolean} conditional.ViewModel.prototype.editEnabled editEnabled
     * @parent conditional.ViewModel
     *
     * Whether the component's edit options are enabled or not.
     */
    editEnabled: {
      value: true
    },

    /**
     * @property {Boolean} conditional.ViewModel.prototype.editActive editActive
     * @parent conditional.ViewModel
     *
     * Whether the component is currently selected, which displays the element
     * options pane that allows user to edit its content.
     */
    editActive: {
      value: false
    },

    /**
     * @property {String} conditional.ViewModel.prototype.operator operator
     * @parent conditional.ViewModel
     *
     * This is the operator used in the expression that the if statement will
     * evaluate in order to execute either the statements in the if body or the
     * ones in the else.
     *
     * Possible values are: 'is-true', 'is-false', 'is-equal',  'is-not-equal',
     * 'is-greater-than', and 'is-less-than'.
     */
    operator: {
      type: 'string',
      value: 'is-true'
    },

    /**
     * @property {Boolean} conditional.ViewModel.prototype.elseClause elseClause
     * @parent conditional.ViewModel
     *
     * Whether the else clause is required.
     */
    elseClause: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} conditional.ViewModel.prototype.unaryOperation unaryOperation
     * @parent conditional.ViewModel
     *
     * Whether [operator] only requires one operand.
     *
     * E.g: 'is-true' only requires one operand.
     */
    unaryOperation: {
      get () {
        let operator = this.attr('operator')
        return _includes(['is-true', 'is-false'], operator)
      }
    },

    /**
     * @property {String} conditional.ViewModel.prototype.leftOperand leftOperand
     * @parent conditional.ViewModel
     *
     * Variable name or static text typed by the user.
     *
     * The if-else element is currently designed to evaluate a single expression
     * like `(operand1 operator operand2)`, a concrete example might be something
     * like `WitnessCount >= 2`; `operand1` is represented in the viewModel as
     * `leftOperand` and it's the first the user picks/enters through the UI.
     */
    leftOperand: {
      value: ''
    },

    /**
     * @property {String} conditional.ViewModel.prototype.rightOperand rightOperand
     * @parent conditional.ViewModel
     *
     * Variable name or static text typed by the user.
     *
     * When the operator chose by the user requires two operands (e.g is greater
     * than) a new input is presented to the user so they can either pick a new
     * variable from the selected interview or type a static text. This value
     * is represented in the viewModel as `rightOperand`
     */
    rightOperand: {
      value: ''
    },

    /**
     * @property {String} conditional.ViewModel.prototype.leftOperandType leftOperandType
     * @parent conditional.ViewModel
     *
     * Whether [leftOperand] holds a variable name or just text entered by the
     * user.
     */
    leftOperandType: {
      value: 'variable'
    },

    /**
     * @property {String} conditional.ViewModel.prototype.rightOperandType rightOperandType
     * @parent conditional.ViewModel
     *
     * Whether [rightOperand] holds a variable name or just text entered by the
     * user.
     */
    rightOperandType: {
      value: 'variable'
    },

    /**
     * @property {A2JTemplate} conditional.ViewModel.prototype.ifBody ifBody
     * @parent conditional.ViewModel
     *
     * A2JTemplate instance that represents the tree of elements that will be
     * rendered in the final PDF document if the condition set by the user
     * evaluates to `true` (`evalCondition()` yields `true`).
     */
    ifBody: {
      get () {
        const children = this.attr('children')
        return children.attr(0)
      }
    },

    /**
     * @property {A2JTemplate} conditional.ViewModel.prototype.elseBody elseBody
     * @parent conditional.ViewModel
     *
     * A2JTemplate instance that represents the tree of elements that will be
     * rendered in the final PDF document if the condition set by the user
     * evaluates to `false` (`evalCondition()` yields `false`).
     */
    elseBody: {
      get () {
        const children = this.attr('children')
        return children.attr(1)
      }
    },

    /**
     * @property {A2JNode} conditional.ViewModel.prototype.addToIfNode addToIfNode
     * @parent conditional.ViewModel
     *
     * A2JNode instance used to bind some properties of the
     * `conditional-add-element` instance used to add elements to `ifBody`.
     */
    addToIfNode: {
      get () {
        const children = this.attr('children')
        return children.attr(2)
      }
    },

    /**
     * @property {A2JNode} conditional.ViewModel.prototype.addToElseNode addToElseNode
     * @parent conditional.ViewModel
     *
     * A2JNode instance used to bind some properties of the
     * `conditional-add-element` instance used to add elements to `elseBody`.
     */
    addToElseNode: {
      get () {
        const children = this.attr('children')
        return children.attr(3)
      }
    },

    toggleEditActiveNode: {},
    cloneNode: {},
    deleteNode: {},
    updateNode: {},
    deleted: {},
    nodeId: {},
    variablesList: {}
  },

  init () {
    this.setChildrenIfEmpty()
  },

  /**
   * @function conditional.ViewModel.prototype.updateNodeState updateNodeState
   * @parent conditional.ViewModel
   *
   * Callback passed down to the `a2j-templates` used in `ifBody`/`elseBody` to
   * to be called when the children of these template instances are saved.
   */
  updateNodeState () {
    const id = this.attr('nodeId')
    const updateNode = this.attr('updateNode')

    if (_isFunction(updateNode)) {
      updateNode(id)
    } else {
      console.error('updateNode should be a function')
    }
  },

  /**
   * @function conditional.ViewModel.prototype.setChildrenIfEmpty setChildrenIfEmpty
   * @parent conditional.ViewModel
   *
   * This is a *hack* to register the instances of `A2JTemplate` and `A2JNode`
   * used for `ifBody`/`elseBody` and the `conditional-add-element` instances as
   * `a2j-conditional` children.
   *
   * `a2j-template` has logic to recursively walk through its children
   * (and children of its children) to make sure there is only one selected element,
   * it makes sense for `a2j-conditional` to be parent of the properties mentioned
   * before, it just feels odd to rely on their order inside children.
   *
   *  TODO: Find a better way to do this.
   */
  setChildrenIfEmpty () {
    const children = this.attr('children')

    if (!children.attr('length')) {
      const addElementNode = {
        state: {},
        children: [],
        tag: 'conditional-add-element'
      }

      children.replace([
        new A2JTemplate(),
        new A2JTemplate(),
        new A2JNode(addElementNode),
        new A2JNode(addElementNode)
      ])
    }
  },

  /**
   * @function conditional.ViewModel.prototype.evalCondition evalCondition
   * @return {Boolean} Result of evaluating the condition set by the user.
   */
  evalCondition () {
    return evalAuthorCondition({
      answers: this.attr('answers'),
      operator: this.attr('operator'),
      leftOperand: this.attr('leftOperand'),
      rightOperand: this.attr('rightOperand'),
      rightOperandType: this.attr('rightOperandType')
    })
  }
})

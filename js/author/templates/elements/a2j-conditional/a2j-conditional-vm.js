import Map from 'can/map/';
import _includes from 'lodash/includes';
import Answers from 'caja/author/models/answers';
import A2JTemplate from 'caja/author/models/a2j-template';

import 'can/view/';
import 'can/map/define/';

/**
 * @property {can.Map} conditional.ViewModel
 * @parent author/templates/elements/a2j-conditional/
 *
 * `<a2j-conditional>`'s viewModel.
 */
export default Map.extend({
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
      get() {
        let operator = this.attr('operator');
        return _includes(['is-true', 'is-false'], operator);
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
     * @property {Boolean} conditional.ViewModel.prototype.hasNestedNodes hasNestedNodes
     * @parent conditional.ViewModel
     *
     * Boolean flag that tells the `a2j-template` parent component that instances
     * of this component (`a2j-conditional`) need to be notified that there is
     * a selected node, since this element owns its own elements it should know when
     * to toggle their `editActive` state when sibling elements are 'selected'.
     */
    hasNestedNodes: {
      value: true
    },

    /**
     * @property {can.Map} conditional.ViewModel.prototype.selectedNode selectedNode
     * @parent conditional.ViewModel
     *
     * View model instance of the currently selected node (element). When set, this
     * setter makes sure the previous set node is de-selected; this prevents that
     * child nodes of the inner template instances used for the `if` and `else`
     * blocks are selected at the same time.
     */
    selectedNode: {
      set(newSelectedNode) {
        let current = this.attr('selectedNode');

        if (current) {
          current.attr('editActive', false);
        }

        return newSelectedNode;
      }
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
      Type: A2JTemplate,
      Value: A2JTemplate
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
      Type: A2JTemplate,
      Value: A2JTemplate
    }
  },

  /**
   * @function conditional.ViewModel.prototype.noOpFn noOpFn
   * @parent conditional.ViewModel
   *
   * An empty function intended to be used as the `saveCallback` of the
   * `a2j-template` instances used in `ifBody`/`elseBody`, this way these
   * template instances are not saved as independent templates but are
   * serialized as any other property of the `a2j-conditional` component state.
   */
  noOpFn: can.noop,

  /**
   * @function conditional.ViewModel.prototype.setSelectedNode setSelectedNode
   * @parent conditional.ViewModel
   *
   * Callback passed down to the instances of `<conditional-add-element />` so
   * `<a2j-conditional />` can set `selectedNode` properly when user selects the
   * add element component.
   */
  setSelectedNode(node) {
    if (node) {
      node.attr('editActive', true);
      this.attr('selectedNode', node);
    }
  },

  /**
   * @function conditional.ViewModel.prototype.deselectNestedNode deselectNestedNode
   * @parent conditional.ViewModel
   *
   * `<a2j-template />` will call this method on every component that own instances
   * of itself, e.g `a2j-conditional` is a child of `<a2j-template />` but owns
   * instances of `<a2j-template />` as well (`ifBody` and `elseBody`). When an
   * element is selected in the parent template, `deselectNestedNode` will be called
   * to make sure any nested element is deselected properly.
   */
  deselectNestedNode() {
    this.attr('selectedNode', null);
  },

  getOperandValue(rightOrLeft = 'left') {
    let answers = this.attr('answers');
    let operand = this.attr(`${rightOrLeft}Operand`);
    let operandType = this.attr(`${rightOrLeft}OperandType`);

    if (operandType === 'text') {
      return operand;
    } else {
      return (answers && operand) ? answers.getValue(operand) : null;
    }
  },

  /**
   * @function conditional.ViewModel.prototype.evalCondition evalCondition
   * @return {Boolean} Result of evaluating the condition set by the user.
   *
   * This method evaluates the condition especified by the user through the UI,
   * it also handles the look up in the answers object if the user set a variable
   * name through var-picker instead of some other (text) value:
   *
   *   - is-true         -> `!!leftOperandValue`
   *   - is-false        -> `!leftOperandValue`
   *   - is-equal        -> `leftOperandValue === rightOperandValue`
   *   - is-not-equal    -> `leftOperandValue !== rightOperandValue`
   *   - is-less-than    -> `leftOperandValue < rightOperandValue`
   *   - is-greater-than -> `leftOperandValue > rightOperandValue`
   */
  evalCondition() {
    let val;
    let operator = this.attr('operator');
    let leftValue = this.getOperandValue('left');
    let rightValue = this.getOperandValue('right');

    switch (operator) {
      case 'is-true':
        val = !!leftValue;
        break;

      case 'is-false':
        val = !leftValue;
        break;

      case 'is-equal':
        val = leftValue === rightValue;
        break;

      case 'is-not-equal':
        val = leftValue !== rightValue;
        break;

      case 'is-greater-than':
        val = leftValue > rightValue;
        break;

      case 'is-less-than':
        val = leftValue < rightValue;
        break;
    }

    return val;
  }
});

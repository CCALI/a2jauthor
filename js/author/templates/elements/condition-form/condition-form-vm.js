import CanMap from "can-map";
import _includes from 'lodash/includes';

/**
 * @module ConditionFormVM
 * @parent ConditionForm
 *
 * `<condition-form />` viewmodel
 */
export default CanMap.extend({
  define: {
    /**
     * @property {Boolean} disabled
     *
     * Whether the form fields are disabled
     */
    disabled: {
      value: false
    },

    /**
     * @property {String} operator
     * @parent TemplateEditTabsVM
     *
     * This is the operator used in the expression that will determine whether
     * the template should be rendered or not.
     *
     * Possible values are: 'is-true', 'is-false', 'is-equal',  'is-not-equal',
     * 'is-greater-than', and 'is-less-than'.
     */
    operator: {
      type: 'string',
      value: 'is-true'
    },

    /**
     * @property {String} leftOperand
     * @parent TemplateEditTabsVM
     *
     * Variable name picked by the user
     *
     * The conditional logic form allows the user to build an expression
     * like:
     *
     *    `(operand1 operator operand2)`
     *
     * `leftOperand` represents operand1 in this example.
     */
    leftOperand: {
      value: ''
    },

    /**
     * @property {String} rightOperand
     * @parent TemplateEditTabsVM
     *
     * Variable name or static text typed by the user.
     *
     * The conditional logic form allows the user to build an expression
     * like:
     *
     *    `(operand1 operator operand2)`
     *
     * `rightOperand` represents operand2 in this example.
     */
    rightOperand: {
      value: ''
    },

    /**
     * @property {String} rightOperandType
     * @parent TemplateEditTabsVM
     *
     * Whether [rightOperand] holds a variable name or just text entered by the
     * user.
     */
    rightOperandType: {
      value: 'variable'
    },

    /**
     * @property {Boolean} isUnaryOperation
     * @parent TemplateEditTabsVM
     *
     * Whether [operator] only requires one operand.
     *
     * E.g: 'is-true' only requires one operand.
     */
    isUnaryOperation: {
      get() {
        let operator = this.attr('operator');
        return _includes(['is-true', 'is-false'], operator);
      }
    },

    variablesList: {}
  }
});

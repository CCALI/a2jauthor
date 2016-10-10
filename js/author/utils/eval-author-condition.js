function getOperandValue(operand, operandType, answers) {
  if (operandType === 'text') {
    return operand;
  } else {
    return (answers && operand) ? answers.getValue(operand) : null;
  }
}

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
export default function(params) {
  const { operator, leftOperand, rightOperand } = params;
  const { rightOperandType, answers } = params;

  let val;
  const leftValue = getOperandValue(leftOperand, 'variable', answers);
  const rightValue = getOperandValue(rightOperand, rightOperandType, answers);

  switch (operator) {
    case 'is-true':
      val = Boolean(leftValue);
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

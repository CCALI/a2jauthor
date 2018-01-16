/*
  SYNTAX WARNING
  ===
  This file is written in CommonJS because it is also used on the server for
    the unified test assembly.
  This file is also written in ES5 syntax because Steal cannot parse ES6+
    syntax unless the file utilitizes import/export.
  This file cannnot use import/export because Node (V <= 8) currently does
    not support ESM import/export.
*/

(function () {
"use strict";

function getOperandValue(operand, operandType, answers) {
  if (operandType === "text") {
    return operand;
  } else {
    return answers && operand ? getAnswerValue(answers, operand) : null;
  }
}

function getAnswerValue(answers, answerName) {
  if (answers.getValue) {
    return answers.getValue(answerName);
  }

  const answer = answers[answerName.toLowerCase()];
  if (!answer) {
    return;
  }

  if (answer.values.length <= 2) {
    return answer.values[1];
  }

  const values = answer.values.slice(1);
  const last = values.pop();
  return values.join(", ") + ' and ' + last;
}

/**
 * @module {function} evalAuthorCondition
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
module.exports = function(params) {
  const operator = params.operator;
  const leftOperand = params.leftOperand;
  const rightOperand = params.rightOperand;
  const rightOperandType = params.rightOperandType;
  const answers = params.answers;

  var val;
  const leftValue = getOperandValue(leftOperand, "variable", answers);
  const rightValue = getOperandValue(rightOperand, rightOperandType, answers);

  switch (operator) {
    case "is-true":
      val =
        leftValue === "true" || (Boolean(leftValue) && leftValue !== "false");
      break;

    case "is-false":
      val = leftValue === "false" || !leftValue;
      break;

    case "is-equal":
      val = leftValue === rightValue;
      break;

    case "is-not-equal":
      val = leftValue !== rightValue;
      break;

    case "is-greater-than":
      val = leftValue > rightValue;
      break;

    case "is-less-than":
      val = leftValue < rightValue;
      break;
  }

  return val;
};
})();

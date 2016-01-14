import Map from 'can/map/';
import _tail from 'lodash/array/tail';
import _last from 'lodash/array/last';
import _initial from 'lodash/array/initial';

import 'can/list/';

const commaString = function(values) {
  if (values.length >= 2) {
    return `${_initial(values).join(', ')} and ${_last(values)}`;
  } else {
    return _last(values);
  }
};

/**
 * @module {Module} author/models/answers Answers
 * @parent api-models
 *
 * This Map constructor function is intended to be used a wrapper for the
 * answers object returned by `parser.parseJSON` when the user uploads an answers
 * file. Said object includes some properties about the variables like its name,
 * repeating flag and array of values, e.g:
 *
 * @codestart
 * 'client first name': {
 *   values: [null],
 *   repeating: false,
 *   name: 'Client First Name'
 * }
 * @codeend
 *
 * This Map, extends the provided object with the functions `getVariable` and
 * `getValue`; `getVariable` returns the variable object provided a variable name
 * (upper or lowercase) and `getValue` has logic to return the value of a variable
 * according to its type.
 */
export default Map.extend({
  /**
   * @function Answers.prototype.getVariable getVariable
   * @param {String} varName Name of the interview variable (not case-sensitive)
   * @parent variable.ViewModel
   *
   * Map instance with some properties of the variable like `name`, `repeating`
   * flag and `values` array.
   */
  getVariable(varName = '') {
    return this.attr(varName.toLowerCase());
  },

  /**
   * @function Answers.prototype.getValue getValue
   * @param {String} varName Name of the interview variable (not case-sensitive)
   * @param {Number} varIndex The index used to access a specific value of a `repeating` variable. (optional)
   *
   * Returns the effective variable value:
   *
   * - If the variable is repeating and no index is requested, then an English
   *   comma delimited string is returned.
   *
   * - If the variable is NOT repeating or only contains a single value
   *   then an index of 1 is defaulted and that element is returned.
   */
  getValue(varName, varIndex) {
    let variable = this.getVariable(varName);

    if (variable) {
      let repeating = variable.attr('repeating');
      let values = _tail(variable.attr('values').attr());

      if (repeating) {
        return (varIndex != null) ? values[varIndex] : commaString(values);
      } else {
        return _last(values);
      }
    }
  }
});

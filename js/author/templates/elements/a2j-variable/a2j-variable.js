import Map from 'can/map/';
import _tail from 'lodash/array/tail';
import _last from 'lodash/array/last';
import Component from 'can/component/';
import _extend from 'lodash/object/extend';
import _initial from 'lodash/array/initial';
import _compact from 'lodash/array/compact';
import template from './a2j-variable.stache!';

import 'can/map/define/';

const commaString = function(values) {
  if (values.length >= 2) {
    return `${_initial(values).join(', ')} and ${_last(values)}`;
  } else {
    return _last(values);
  }
};

/**
 * @module {Module} author/templates/elements/a2j-variable/ <a2j-variable>
 * @parent api-components
 *
 * This component represents a variable of an interview; it renders a small
 * square with the variable name in the Rich Text Editor component and when
 * `useAnswers` is set to `true` and the `answers` object is available, it'll
 * replace the variable name with its actual value.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-variable name="Client First Name" />
 * @codeend
 */

/**
 * @property {can.Map} variable.ViewModel
 * @parent author/templates/elements/a2j-variable/
 *
 * <a2j-variable>'s viewModel.
 */
export let A2JVariableVM = Map.extend({
  define: {
    /**
     * @property {Answer} variable.ViewModel.prototype.variable variable
     * @parent variable.ViewModel
     *
     * This component has access to the `answers` object, which is a map where
     * each key is a variable name (lowercase) and it's value is an object with
     * a few properties, like `name`, `repeating` and `values`. This property
     * looks up the variable name in `answers` and returns its value if found.
     */
    variable: {
      get() {
        let name = this.attr('name');
        let answers = this.attr('answers');

        if (name && answers) {
          return answers.attr(name.toLowerCase());
        }
      },
    },

    /**
     * @property {Number} variable.ViewModel.prototype.varIndex varIndex
     * @parent variable.ViewModel
     *
     * The index used to access a specific value of a `repeating` variable.
     *
     * E.g: if [varIndex] is set to `2`, `variable.attr('values.2')` will be
     * returned if `variable` is `repeating`.
     */
    varIndex: {
      value: null
    },

    /**
     * @property {String} variable.ViewModel.prototype.value value
     * @parent variable.ViewModel
     *
     * The effective variable value:
     * - If the variable is repeating and no index is requested,
     *   then an English comma delimited string is returned.
     *
     * - If the variable is NOT repeating or only contains a single value
     *   then an index of 1 is defaulted and that element is returned.
     */
    value: {
      get() {
        let variable = this.attr('variable');

        if (variable) {
          let repeating = variable.attr('repeating');
          let values = _tail(variable.attr('values').attr());

          if (repeating) {
            let index = this.attr('varIndex');
            return (index != null) ? values[index] : commaString(values);
          } else {
            return _last(values);
          }
        }
      }
    },

    /**
     * @property {Boolean} variable.ViewModel.prototype.showValue showValue
     * @parent variable.ViewModel
     *
     * Whether to show the variable value in the answers object instead of the
     * variable name pass to the component through its attributes.
     */
    showValue: {
      get() {
        let value = this.attr('value');
        let useAnswers = this.attr('useAnswers');

        return value != null && useAnswers;
      }
    }
  }
});

export default Component.extend({
  template,
  tag: 'a2j-variable',

  viewModel(attrs, parentScope) {
    let vmAttrs = _extend({}, attrs);
    let answers = parentScope.attr('answers');
    let varIndex = parentScope.attr('varIndex');

    // only take `varIndex` from the parentScope if it's not null / undefined
    // and if `varIndex` has not been provided as an attribute already.
    if (varIndex != null && vmAttrs.varIndex == null) {
      vmAttrs.varIndex = varIndex;
    }

    if (answers) {
      _extend(vmAttrs, {
        answers: answers.attr(),
        useAnswers: parentScope.attr('useAnswers')
      });
    }

    return new A2JVariableVM(vmAttrs);
  }
});

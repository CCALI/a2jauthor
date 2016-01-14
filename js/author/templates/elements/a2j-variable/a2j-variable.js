import Map from 'can/map/';
import Component from 'can/component/';
import _extend from 'lodash/object/extend';
import template from './a2j-variable.stache!';
import Answers from 'caja/author/models/answers';

import 'can/map/define/';

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
     * @property {Answers} variable.ViewModel.prototype.answers answers
     * @parent variable.ViewModel
     *
     * Answers object available when user uploads an ANX file during document
     * assembly.
     */
    answers: {
      Type: Answers
    },

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
          return answers.getVariable(name);
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
     * The effective variable value.
     */
    value: {
      get() {
        let variable = this.attr('variable');

        if (variable) {
          let name = this.attr('name');
          let answers = this.attr('answers');
          let index = this.attr('varIndex');

          return answers.getValue(name, index);
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

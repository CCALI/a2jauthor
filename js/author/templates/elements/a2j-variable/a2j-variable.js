import _assign from 'lodash/assign'
import Component from 'can-component'
import template from './a2j-variable.stache'
import A2JVariableVM from './a2j-variable-vm'

/**
 * @module {Module} A2jVariable
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
export default Component.extend({
  view: template,
  tag: 'a2j-variable',

  viewModel (attrs, parentScope) {
    let vmAttrs = _assign({}, attrs)
    let answers = parentScope.attr('answers')
    let varIndex = parentScope.attr('varIndex')

    // only take `varIndex` from the parentScope if it's not null / undefined
    // and if `varIndex` has not been provided as an attribute already.
    if (varIndex != null && vmAttrs.varIndex == null) {
      vmAttrs.varIndex = varIndex
    }

    if (answers) {
      _assign(vmAttrs, {
        answers: answers.attr(),
        useAnswers: parentScope.attr('useAnswers')
      })
    }

    return new A2JVariableVM(vmAttrs)
  },

  leakScope: true
})

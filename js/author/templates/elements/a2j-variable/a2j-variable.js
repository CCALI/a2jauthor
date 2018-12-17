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
    const vmAttrs = _assign({}, attrs)
    const answers = parentScope && parentScope.get('answers')
    const varIndex = parentScope && parentScope.get('varIndex')
    const name = this.element.getAttribute('name')

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

    if (name) {
      // Set the name on the VM from the element attribute
      _assign(vmAttrs, {
        name
      })
    }

    return new A2JVariableVM(vmAttrs)
  }
})

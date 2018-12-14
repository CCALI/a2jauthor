import Component from 'can-component'
import template from './a2j-legal-nav-resource.stache'
import A2JLegalNavResourceVM from './a2j-legal-nav-resource-vm'

/**
 * @module {Module} A2jLegalNavResource
 * @parent api-components
 *
 * This component represents a legal-nav-resource-id it will replace the guid
 * and display a pretty name for readability.
 *
 * ## Use
 *
 * @codestart
 *   <legal-nav-resource-id guid="guid" name="name" />
 * @codeend
 */
export default Component.extend({
  view: template,
  tag: 'legal-nav-resource-id',
  viewModel () {
    const name = this.element.getAttribute('name')
    return new A2JLegalNavResourceVM({
      name
    })
  }
})

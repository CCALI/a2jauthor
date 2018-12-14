import DefineMap from 'can-define/map/map'

/**
 * @property {can.DefineMap} a2jLegalNavResource.ViewModel
 * @parent author/templates/elements/a2j-legal-nav-resource/
 *
 * `<legal-nav-resource-id>`'s viewModel.
 */
export default DefineMap.extend('a2j-legal-nav-resource', {
  /**
   * @property {String|NULL} a2jLegalNavResource.ViewModel.prototype.guid guid
   * @parent a2jLegalNavResource.ViewModel
   *
   * The guid for this legal-nav-resource.
   */
  guid: {
    default: null
  },
  /**
   * @property {String|NULL} a2jLegalNavResource.ViewModel.prototype.name name
   * @parent a2jLegalNavResource.ViewModel
   *
   * The name for this legal-nav-resource.
   */
  name: {
    default: null
  }
})

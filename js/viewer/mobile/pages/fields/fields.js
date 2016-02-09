import Map from 'can/map/';
import Component from 'can/component/';
import template from './fields.stache!';

import 'viewer/mobile/pages/fields/field/';

/**
 * @property {can.Map} fields.ViewModel
 * @parent <a2j-fields>
 *
 * `<a2j-fields>`'s viewModel.
 */
let FieldsVM = Map.extend({});

/**
 * @module {Module} viewer/mobile/pages/fields/ <a2j-fields>
 * @parent api-components
 *
 * This component displays a list of `<a2j-field>` components.
 *
 * ## Use
 *
 * @codestart
 * <a2j-fields {(fields)}="fields"></a2j-fields>
 * @codeend
 */
export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-fields',
  viewModel: FieldsVM
});

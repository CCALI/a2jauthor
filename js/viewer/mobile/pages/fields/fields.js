import Map from 'can/map/';
import Component from 'can/component/';
import template from './fields.stache!';

import 'viewer/mobile/pages/fields/field/';

let FieldsVM = Map.extend({});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-fields',
  viewModel: FieldsVM
});

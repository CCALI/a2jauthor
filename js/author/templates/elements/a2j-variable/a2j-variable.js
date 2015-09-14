import Map from 'can/map/';
import Component from 'can/component/';
import template from './a2j-variable.stache!';

import 'can/map/define/';

export let A2JVariableVM = Map.extend({
  define: {
    /**
     * @property {A2JVariable} variable
     */
    variable: {
      value: ''
    }
  }
});

export default Component.extend({
  tag: 'a2j-variable',
  viewModel: A2JVariableVM,
  leakScope: false,
  template
});

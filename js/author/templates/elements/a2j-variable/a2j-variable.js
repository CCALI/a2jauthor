import Map from 'can/map/';
import Component from 'can/component/';
import template from './a2j-variable.stache!';
import Variable from 'author/models/a2j-variable';

import 'can/map/define/';

export let A2JVariableVM = Map.extend({
  define: {
    /**
     * @property {A2JVariable} variable
     */
    variable: {
      get: function(currentValue, setValue) {
        let name = this.attr('name');

        Variable.findOne({ name }).then(setValue);
      },
    },
    /**
     * @property {Number} index
     *
     * Values are stored in a one-based array whether the variable is repeating
     * or not.
     */
    index: {
      value: undefined
    },
    /**
     * @property {String} value
     *
     * The effective variable value.
     * - If the variable is repeating and no index is requested,
     *   then an English comma delimited string is returned.
     * - If the variable is NOT repeating or only contains a single value
     *   then an index of 1 is defaulted and that element is returned.
     */
    value: {
      get: function() {
        let variable = this.attr('variable');

        if(!variable) {
          return '';
        }

        let values = variable.attr('values').attr() || [];
        let index = this.attr('index');
        let repeating = variable.attr('repeating');

        if(repeating && values.length > 2 && !index) {
          return [].concat(values.slice(1, -1),
            'and ' + values.slice(-1)).join(', ');
        }
        else if(!index) {
          index = 1;
        }

        return variable.attr('values.' + index);
      }
    },
    /**
     * @property {Boolean} isUndeclared
     *
     * Whether the variable was found in the global gGuide.vars structure.
     */
    isUndeclared: {
      get: function() {
        let variable = this.attr('variable');

        return variable && variable.isNew();
      }
    }
  }
});

export default Component.extend({
  tag: 'a2j-variable',
  viewModel: A2JVariableVM,
  leakScope: false,
  template
});

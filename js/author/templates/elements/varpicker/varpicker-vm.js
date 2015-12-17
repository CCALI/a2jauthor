import Map from 'can/map/';
import List from 'can/list/';
import A2JVariable from 'author/models/a2j-variable';

import 'can/map/define/';

/**
 * @property {can.Map} varPicker.ViewModel
 * author/templates/elements/var-picker/
 *
 * `<var-picker>`'s viewModel.
 */
export default Map.extend({
  define: {
    /**
     * @property {String} varPicker.ViewModel.prototype.selected selected
     * @parent varPicker.ViewModel
     *
     * Name of the variable selected by the user.
     */
    selected: {
      value: ''
    },

    /**
     * @property {A2JVariable.List} varPicker.ViewModel.prototype.variables variables
     * @parent varPicker.ViewModel
     *
     * List of A2JVariable objects, since `window.gGuide` models the variables
     * using a key/value format, this property takes that record (`gGuide.vars`)
     * and generates an actual list of variables out of it.
     */
    variables: {
      set(vars) {
        return A2JVariable.fromGuideVars(vars.attr());
      }
    },

    /**
     * @property {can.List} varPicker.ViewModel.prototype.variableNames variableNames
     * @parent varPicker.ViewModel
     *
     * List of variables names, this derived from the [variables] list.
     */
    variableNames: {
      get() {
        let names = new List([]);
        let variables = this.attr('variables');

        if (variables && variables.length) {
          names = variables.map(v => v.attr('name'));
        }

        return names;
      }
    }
  }
});

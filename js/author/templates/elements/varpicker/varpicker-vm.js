import Map from 'can/map/';
import List from 'can/list/';
import _compact from 'lodash/array/compact';
import _includes from 'lodash/collection/includes';
import A2JVariable from 'caja/author/models/a2j-variable';

import 'can/map/define/';

const ocurrences = ['any', 'single', 'repeating'];

const byRepeating = function(filter, variable) {
  if (filter !== 'any') {
    let repeating = filter === 'repeating';
    return variable.attr('repeating') === repeating;
  } else {
    return true;
  }
};

const byType = function(types, variable) {
  if (types.length) {
    let type = variable.attr('type').toLowerCase();
    return _includes(types, type);
  } else {
    return true;
  }
};

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
     * @property {String} varPicker.ViewModel.prototype.filterOcurrence filterOcurrence
     * @parent varPicker.ViewModel
     *
     * The variables can be either `repeating` (multiple values) or just
     * `single` value. This property filter the [variables] list by looking
     * into the `repeating` property. If the value is `any`, the value of
     * `repeating` is ignored by the filter, but if the value is `repeating`
     * only those variables with `repeating` set to true will be in the list;
     * finally if the value is `single`, only the non-repeating variables will
     * be in the list.
     */
    filterOcurrence: {
      value: 'any',
      set(value) {
        return _includes(ocurrences, value) ? value : 'any';
      }
    },

    /**
     * @property {Array} varPicker.ViewModel.prototype.filterTypes filterTypes
     * @parent varPicker.ViewModel
     *
     * Array of variable types used to filter the [variable] list.
     */
    filterTypes: {
      set(value = '') {
        return _compact(value.split(','))
          .map(t => t.toLowerCase().trim());
      }
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
      Value: A2JVariable.List,
      get(list) {
        let types = this.attr('filterTypes');
        let ocurrence = this.attr('filterOcurrence');

        return list
          .filter(v => byType(types, v))
          .filter(v => byRepeating(ocurrence, v));
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

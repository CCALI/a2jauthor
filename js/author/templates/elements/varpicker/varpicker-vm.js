import $ from 'jquery'
import CanMap from 'can-map'
import CanList from 'can-list'
import _compact from 'lodash/compact'
import _includes from 'lodash/includes'
import Bloodhound from 'typeahead.js/dist/bloodhound'

import 'can-map-define'

const ocurrences = ['any', 'single', 'repeating']

const byRepeating = function (filter, variable) {
  if (filter !== 'any') {
    let repeating = filter === 'repeating'
    return variable.attr('repeating') === repeating
  } else {
    return true
  }
}

const byType = function (types, variable) {
  if (types && types.length) {
    let type = variable.attr('type') || ''
    return _includes(types, type.toLowerCase())
  } else {
    return true
  }
}

/**
 * @property {can.Map} varPicker.ViewModel
 * author/templates/elements/var-picker/
 *
 * `<var-picker>`'s viewModel.
 */
export default CanMap.extend("VarPickerVM", {
  define: {
    /**
     * @property {Boolean} disabled
     *
     * Whether the picker is disabled
     */
    disabled: {
      value: false
    },

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
      set (value) {
        return _includes(ocurrences, value) ? value : 'any'
      }
    },

    /**
     * @property {Array} varPicker.ViewModel.prototype.filterTypes filterTypes
     * @parent varPicker.ViewModel
     *
     * Array of variable types used to filter the [variable] list.
     */
    filterTypes: {
      value: '',
      set (value = '') {
        return _compact(value.split(','))
          .map(t => t.toLowerCase().trim())
      }
    },

    /**
     * @property {A2JVariable.List} varPicker.ViewModel.prototype.variables variables
     * @parent varPicker.ViewModel
     *
     * List of A2JVariable objects.
     */
    variables: {
      get (list) {
        let types = this.attr('filterTypes')
        let ocurrence = this.attr('filterOcurrence')

        if (list) {
          return list
            .filter(v => byType(types, v))
            .filter(v => byRepeating(ocurrence, v))
        }
      }
    },

    /**
     * @property {can.List} varPicker.ViewModel.prototype.variableNames variableNames
     * @parent varPicker.ViewModel
     *
     * List of variables names, this derived from the [variables] list.
     */
    variableNames: {
      get () {
        let names = new CanList([])
        let variables = this.attr('variables')

        if (variables && variables.length) {
          names = variables.map(v => v.attr('name'))
        }

        return names
      }
    }
  },

  connectedCallback (el) {
      let vm = el.viewModel
      let selected = vm.attr('selected')
      let $input = $(el).find('.form-control')
      let variableNames = vm.attr('variableNames').attr()

      let engine = new Bloodhound({
        local: variableNames,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        datumTokenizer: Bloodhound.tokenizers.whitespace
      })

      setTimeout(function () {
        $input
          .tokenfield({
            limit: 1,
            tokens: selected,
            inputType: 'text',
            createTokensOnBlur: false,
            typeahead: [null, { source: engine.ttAdapter() }]
          })
          .trigger('tokenfield:initialized')
          .show()
      })

    // ListenTo the disabled change and set the $.tokenField to
    // enable | disable the plugin when the disabled scope changes
    this.listenTo('disabled', function (ev, newVal) {
      $input.tokenfield(newVal ? 'disable' : 'enable')
    })

    // we think the typeahead plugin messes up the `value:bind' in the input (by
    // removing it from the DOM or preventDefault/stopPropagation or something),
    // but this works around the issue
    $input.on('change', function pickerInputChanged() {
      vm.attr('selected', this.value)
    })
  }
})

import $ from 'jquery'
import Bloodhound from 'typeahead.js/dist/bloodhound'
import Component from 'can-component'
import VarPickerVM from './varpicker-vm'
import template from './varpicker.stache'

import 'typeahead.js/dist/typeahead.jquery'
import 'bootstrap-tokenfield'

/**
 * @module {Module} author/templates/elements/var-picker/ <var-picker>
 * @parent api-components
 *
 * This is an input-like component that supports tagging and uses typeahead to
 * filter results in a given collection while user types. It is intented to allow
 * the user to pick a variable from the ones defined in a guided interview.
 *
 * ## Use
 *
 * @codestart
 *   <var-picker {variables}="guide.vars" {^selected-variable}="selected" />
 * @codeend
 */

export default Component.extend({
  view: template,
  tag: 'var-picker',
  viewModel: VarPickerVM,

  events: {
    inserted () {
      let vm = this.viewModel
      let selected = vm.attr('selected')
      let $input = $(this.element).find('input')
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
            typeahead: [null, {source: engine.ttAdapter()}]
          })
          .trigger('tokenfield:initialized')
          .show()
      })
    },

    '{element} beforeremove' () {
      let $input = $(this.element).find('input')

      $input
        .tokenfield('destoy')
        .trigger('tokenfield:destroyed')
    },

    // when a token in created, hide the inner input, we don't need to show
    // it because only one token can be created at a time (by now) and also
    // when the `var-picker` is really small, adding a token causes the input
    // to overflow to a new line, which looks broken.
    'input tokenfield:createdtoken': function () {
      $(this.element).find('.token-input.tt-input').hide()
    },

    // bring back the input once the existing token is removed, so user can
    // select a new token.
    'input tokenfield:removedtoken': function () {
      $(this.element).find('.token-input.tt-input').show()
    }
  },

  leakScope: true
})

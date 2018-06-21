import Map from 'can/map/'
import Component from 'can/component/'
import _includes from 'lodash/includes'
import template from './popover.stache'

import 'can/map/define/'

const placements = ['top', 'right', 'bottom', 'left', 'auto']

/**
 * @module {Module} popover <app-popover>
 * @parent api-components
 *
 * Wrapper component for bootstrap's popover element.
 *
 * ## Use
 *
 * @codestart
 * <app-popover title="foo bar" placement="right">
 *   popover content
 * </app-popover>
 * @codeend
 */

/**
 * @property {can.Map} popover.ViewModel
 * @parent popover
 *
 * `<app-popover>`'s viewModel.
 */
export let Popover = Map.extend({
  define: {
    /**
     * @property {String} popover.ViewModel.prototype.define.title title
     * @parent popover.ViewModel
     *
     * Popover's title.
     */
    title: {
      type: 'string',
      value: ''
    },

    /**
     * @property {String} popover.ViewModel.prototype.define.placement placement
     * @parent popover.ViewModel
     *
     * The position of the popover, possible values are `top`, `bottom`, `left`,
     * `right`, or `auto`. Defaults to `right`.
     *
     * @codestart
     * <app-popover placement="top"></app-popover>
     * @codeend
     */
    placement: {
      value: 'right',

      type (value) {
        return _includes(placements, value) ? value : 'right'
      }
    }
  }
})

export default Component.extend({
  template,
  leakScope: false,
  viewModel: Popover,
  tag: 'app-popover'
})

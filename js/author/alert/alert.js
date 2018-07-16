import CanMap from 'can-map'
import Component from 'can-component'
import template from './alert.stache'
import canDomEvents from 'can-dom-events'
import $ from 'jquery'
import 'can-map-define'

const alertTypeClasses = {
  info: 'alert-info',
  danger: 'alert-danger',
  default: 'alert-default',
  success: 'alert-success',
  warning: 'alert-warning'
}

const alertTypeSymbols = {
  info: 'glyphicon-info-circled',
  danger: 'glyphicon-attention',
  default: '',
  success: '',
  warning: 'glyphicon-info-circled'
}

/**
 * @module {Module} author/alert <app-alert>
 * @parent api-components
 *
 * Wrapper component for bootstrap's alert elements. It adds the ability to
 * auto close the alert after a certain amount of time defined by the user.
 *
 * ## Use
 *
 * @codestart
 *  <app-alert open="true">
 *    Alert content goes here!
 *  </app-alert>
 * @codeend
 */

/**
 * @property {can.Map} alert.ViewModel
 * @parent author/alert
 *
 * `<app-alert>`'s viewModel.
 */
export let Alert = CanMap.extend({
  define: {
    /**
     * @property {Boolean} alert.ViewModel.prototype.define.autoClose autoClose
     * @parent alert.ViewModel
     *
     * Whether the alert will close itself automatically after `autoCloseTime`.
     */
    autoClose: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} alert.ViewModel.prototype.define.dismissible dismissible
     * @parent alert.ViewModel
     *
     * Whether user is allowed to dismiss the alert through a close (x) button.
     */
    dismissible: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {String} alert.ViewModel.prototype.define.alertType alertType
     * @parent alert.ViewModel
     *
     * It controls how the alert looks, there are five possible options, four of
     * them are the default provided by bootstrap (success, info, warning, and
     * danger) and there is a `default` type which just adds a border to the
     * `.alert` element.
     *
     * @codestart
     * <app-alert open="true" alert-type="warning">
     *   Something happened!
     * </app-alert>
     * @codeend
     */
    alertType: {
      type: 'string',
      value: 'default'
    },

    /**
     * @property {Number} alert.ViewModel.prototype.define.autoCloseTimeoutId autoCloseTimeoutId
     * @parent alert.ViewModel
     *
     * Numerical id returned by `setTimeout`, it's used to clear the timeout
     * when user closes the alert through the close button.
     */
    autoCloseTimeoutId: {
      type: 'number'
    },

    /**
     * @property {Number} alert.ViewModel.prototype.define.autoCloseTime autoCloseTime
     * @parent alert.ViewModel
     *
     * Number of miliseconds after which the alert will close itself.
     */
    autoCloseTime: {
      type: 'number',
      value: 5000
    },

    /**
     * @property {Boolean} alert.ViewModel.prototype.define.open open
     * @parent alert.ViewModel
     *
     * Whether the alert is opened or closed. Setting it will cause the alert
     * to slide down or up based on its previous value, also, when set to `true`
     * a timeout will be created to set its value back to `false`  (if `autoClose`
     * is `true`).
     */
    open: {
      type: 'boolean',
      value: false,
      set (newVal) {
        let autoClose = this.attr('autoClose')

        if (autoClose && newVal) {
          this.setAutoCloseTimeout()
        }

        return newVal
      }
    }
  },

  setAutoCloseTimeout () {
    let delay = this.attr('autoCloseTime')

    this.clearAutoCloseTimeout()

    let timeoutId = setTimeout(() => {
      this.closeAlert()
    }, delay)

    this.attr('autoCloseTimeoutId', timeoutId)
  },

  /**
   * @property {function} alert.ViewModel.prototype.closeAlert closeAlert
   * @parent alert.ViewModel
   *
   * Closes the alert (slides it up) when called, and makes sure to clear up
   * the timeout id stored. This method is called when user clicks the close
   * button.
   */
  closeAlert () {
    this.clearAutoCloseTimeout()
    this.attr('open', false)
  },

  clearAutoCloseTimeout () {
    let timeoutId = this.attr('autoCloseTimeoutId')

    clearTimeout(timeoutId)
    this.attr('autoCloseTimeoutId', null)
  }
})

export default Component.extend({
  view: template,
  tag: 'app-alert',
  ViewModel: Alert,

  events: {
    inserted () {
      this.element = $(this.element)
      if (this.viewModel.attr('open')) {
        this.element.show()
      } else {
        this.element.hide()
      }
    },

    '{viewModel} open': function () {
      let $el = $(this.element)
      let vm = this.viewModel
      let open = vm.attr('open')

      if (open) {
        $el.slideDown()
      } else {
        $el.slideUp(() => canDomEvents.dispatch(vm, 'closed'))
        vm.clearAutoCloseTimeout()
      }
    }
  },

  helpers: {
    alertTypeClass () {
      let type = this.attr('alertType')
      return alertTypeClasses[type]
    },
    alertTypeSymbol () {
      let type = this.attr('alertType')
      return alertTypeSymbols[type]
    }
  },

  leakScope: true
})

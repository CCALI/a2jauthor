import Map from 'can/map/';
import Component from 'can/component/';
import template from './alert.stache!';

import './alert.less!';
import 'can/map/define/';

const alertTypeClasses = {
  info: 'alert-info',
  danger: 'alert-danger',
  default: 'alert-default',
  success: 'alert-success',
  warning: 'alert-warning'
};

/**
 * @module {Module} author/alert/
 * @parent api-components
 *
 * Provides the view model and component constructors for the `<app-alert>`
 * custom tag which takes care of displaying simple alert messages based on
 * the bootstrap alert component. It will automatically close itself after some
 * time that can be provided by the ser.
 */


/**
 * @function AlertViewModel
 * Constructor used as the viewModel of the `<app-alert>` component.
 */
export let Alert = Map.extend({
  define: {
    /**
     * @property {Boolean} AlertViewModel.prototype.define.autoClose autoClose
     *
     * Whether the alert will close itself automatically after `autoCloseTime`.
     */
    autoClose: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {Boolean} AlertViewModel.prototype.define.dismissible dismissible
     *
     * Whether user is allowed to dismiss the alert through a close (x) button.
     */
    dismissible: {
      type: 'boolean',
      value: false
    },

    /**
     * @property {String} AlertViewModel.prototype.define.alertType alertType
     *
     * It controls how the alert looks, there are five possible options, four of
     * them are the default provided by bootstrap (success, info, warning, and
     * danger) and there is a `default` type which just adds a border to the
     * `.alert` element.
     */
    alertType: {
      type: 'string',
      value: 'default'
    },

    /**
     * @property {Number} AlertViewModel.prototype.define.autoCloseTimeoutId autoCloseTimeoutId
     *
     * Numerical id returned by `setTimeout`, it's used to clear the timeout
     * when user closes the alert through the close button.
     */
    autoCloseTimeoutId: {
      type: 'number'
    },

    /**
     * @property {Number} AlertViewModel.prototype.define.autoCloseTime autoCloseTime
     *
     * Number of miliseconds after which the alert will close itself.
     */
    autoCloseTime: {
      type: 'number',
      value: 5000
    },

    /**
     * @property {Boolean} AlertViewModel.prototype.define.open open
     *
     * Whether the alert is opened or closed. Setting it will cause the alert
     * to slide down or up based on its previous value, also, when set to `true`
     * a timeout will be created to set its value back to `false`  (if `autoClose`
     * is `true`).
     */
    open: {
      type: 'boolean',
      set(newVal) {
        let autoClose = this.attr('autoClose');

        if (autoClose && newVal) {
          this.setAutoCloseTimeout();
        }

        return newVal;
      }
    },
  },

  setAutoCloseTimeout() {
    let delay = this.attr('autoCloseTime');

    this.clearAutoCloseTimeout();

    let timeoutId = setTimeout(() => {
      this.attr('open', false);
    }, delay);

    this.attr('autoCloseTimeoutId', timeoutId);
  },

  /**
   * @property {function} AlertViewModel.prototype.closeAlert closeAlert
   *
   * Closes the alert (slides it up) when called, and makes sure to clear up
   * the timeout id stored. This method is called when user clicks the close
   * button.
   */
  closeAlert() {
    this.clearAutoCloseTimeout();
    this.attr('open', false);
  },

  clearAutoCloseTimeout() {
    let timeoutId = this.attr('autoCloseTimeoutId');

    clearTimeout(timeoutId);
    this.attr('autoCloseTimeoutId', null);
  }
});


/**
 * @function AppAlertComponent
 * Constructor function that defines the custom `<app-alert>` tag behavior.
 */
export default Component.extend({
  template,
  tag: 'app-alert',
  leakScope: false,
  viewModel: Alert,

  events: {
    inserted() {
      if (this.viewModel.attr('open')) {
        this.element.find('.alert-wrapper').show();
      }
    },

    '{viewModel} open': function() {
      let open = this.viewModel.attr('open');
      let $wrapper = this.element.find('.alert-wrapper');

      if (open) {
        $wrapper.slideDown();
      } else {
        $wrapper.slideUp();
        this.viewModel.clearAutoCloseTimeout();
      }
    }
  },

  helpers: {
    alertTypeClass() {
      let type = this.attr('alertType');
      return alertTypeClasses[type];
    }
  }
});

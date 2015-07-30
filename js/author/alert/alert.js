import Map from 'can/map/';
import Component from 'can/component/';
import template from './alert.stache!';

import './alert.less!';
import 'can/map/define/';

const alertStates = {
  opened: 'opened',
  closed: 'closed'
};

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
     * @property {Number} AlertViewModel.prototype.define.transitionId transitionId
     *
     * It holds the numerical id returned by `setTimeout`, it's used to clear
     * the timeout when user closes the alert by using the close button.
     */
    transitionId: {
      type: 'number'
    },

    /**
     * @property {Number} AlertViewModel.prototype.define.transitionTime transitionTime
     *
     * It holds the number of miliseconds after which the alert will close itself.
     */
    transitionTime: {
      type: 'number',
      value: 5000
    },

    /**
     * @property {String} AlertViewModel.prototype.define.state state
     *
     * It holds the current state of the alert, which can be either `opened` or
     * `closed`. Setting it will cause the alert to slide down or up based on its
     * previous value, also, when set to `opened` it will automatically change itself
     * to `closed` after the time specified by `transitionTime`.
     */
    state: {
      type: 'string',
      set(newVal) {
        if (newVal === alertStates.opened) {
          let delay = this.attr('transitionTime');

          this.clearTransition();

          let timeoutId = setTimeout(() => {
            this.attr('state', alertStates.closed);
          }, delay);

          this.attr('transitionId', timeoutId);
        }

        return newVal;
      }
    },
  },

  /**
   * @property {function} AlertViewModel.prototype.closeAlert closeAlert
   *
   * Closes the alert (slides it up) when called, and makes sure to clear up
   * the `transitionId` stored. This method is called when user clicks the close
   * button.
   */
  closeAlert() {
    this.clearTransition();
    this.attr('state', alertStates.closed);
  },

  clearTransition() {
    let timeoutId = this.attr('transitionId');
    clearTimeout(timeoutId);
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
    '{viewModel} state': function() {
      let state = this.viewModel.attr('state');
      let $wrapper = this.element.find('.alert-wrapper');

      if (state === alertStates.opened) {
        $wrapper.slideDown();
      } else {
        $wrapper.slideUp();
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

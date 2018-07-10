import Component from "can-component";
import template from './condition-form.stache';
import ConditionFormVM from './condition-form-vm';

/**
 * @module ConditionForm
 * @parent api-components
 *
 * Form to allow the author to define a condition to be used
 * in an if statement
 */
export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'condition-form',
  ViewModel: ConditionFormVM
});

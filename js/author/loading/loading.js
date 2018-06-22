import Component from "can-component"
import template from './loading.stache'

export default Component.extend({
  view: template,
  tag: 'app-loading',
  leakScope: true
})

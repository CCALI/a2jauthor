import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './page-buttons.stache'
import { TButton } from '~/legacy/viewer/A2J_Types'
import constants from 'a2jauthor/src/models/constants'

export const PageButtonsVM = DefineMap.extend('PageButtonsVM', {
  page: {},
  appState: {},

  forceNonObservableUpdate: {
    type: 'number',
    default: 0
  },
  buttonIsDisplayMessage (button) {
    return button.next === constants.qMESSAGE
  },

  // el is the button element itself,
  // button is the page button object,
  // index is which button it is in the buttons list
  pickPageDialog (el, button, index) {
    const vm = this
    return window.form.pickPageDialog(el, {
      value: button.next,
      label: 'Destination:',
      buttonText: 'Set Destination',
      change: function (val, b, ff) {
        button.next = val
        // ff is jquery wrapped el.closest('tr') and I think the var name means 'fieldset field'? or 'form fieldset'?
        window.updateButtonLayout(ff, button)
        vm.showMessageInputForButton[index] = vm.buttonIsDisplayMessage(button)
        vm.forceNonObservableUpdate = vm.forceNonObservableUpdate + 1
      }
    })
  },

  get observableButtons () {
    // bind to the length / update when it changes
    this.numButtons // eslint-disable-line
    return new DefineList(this.page.buttons || [])
  },

  get showMessageInputForButton () {
    this.forceNonObservableUpdate // eslint-disable-line
    return this.observableButtons.map(b => this.buttonIsDisplayMessage(b))
  },

  numButtons: {
    default: '1',
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        val = Math.min(Math.max(val, 1), 3)
        while (this.page.buttons.length < val) {
          this.page.buttons.push(new TButton())
        }
        this.page.buttons.length = val
        resolve(val + '')
      })
      resolve((this.page.buttons.length || 1) + '')
    }
  },

  parseInt (val) {
    return parseInt(val)
  },

  get legacySection () {
    return window.buildButtonFieldSet(this.page)
  },

  connectedCallback (pageButtonsEl) {
    // uses existing legacy code to update if the button url field is visible for existing buttons
    const buttonRows = pageButtonsEl.querySelectorAll('.button-row')
    this.observableButtons.forEach((b, i) => {
      window.updateButtonLayout($(buttonRows[i]), b)
    })
  }
})

export default Component.extend({
  tag: 'page-buttons',
  view: template,
  leakScope: false,
  ViewModel: PageButtonsVM
})

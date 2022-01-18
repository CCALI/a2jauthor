import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './page-buttons.stache'
import { TButton } from '~/legacy/viewer/A2J_Types'
import constants from 'a2jauthor/src/models/constants'

const ObservableProxy = DefineMap.extend('ObservableProxy', {
  obj: {},
  key: {},
  value: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.obj[this.key] = val
        resolve(val)
      })
      resolve(this.obj[this.key])
    }
  }
})

export const PageButtonsVM = DefineMap.extend('PageButtonsVM', {
  page: {},
  appState: {},

  minButtons: {
    type: 'number',
    default: 1
  },

  maxButtons: {
    type: 'number',
    default: 3
  },

  buttonsChanged: { type: 'number', default: 0 },

  get canRemoveButton () {
    // The legacy-pojo vs modern-observable boundary is a common pain point in dev for many higher-level frameworks. In CanJS &
    // stache, to make legacy objects seem observable, we can reference another observable to trigger our recomputes as needed.
    // This is scaffolding/path-of-least-resistance for incremental upgrades. "The right way" is a much bigger bite of the work.
    this.buttonsChanged // eslint-disable-line
    return parseInt(this.numButtons) > this.minButtons
  },

  get canAddButton () {
    this.buttonsChanged // eslint-disable-line
    return parseInt(this.numButtons) < this.maxButtons
  },

  addButton (button) {
    if (this.canAddButton) {
      this.numButtons = this.numButtons + 1
    }
  },

  removeButton (button) {
    if (this.canRemoveButton) {
      const bi = this.page.buttons.indexOf(button)
      this.page.buttons.splice(bi, 1)
      this.numButtons = this.numButtons - 1
    }
  },

  canMoveButtonUp (button) {
    this.numButtons // eslint-disable-line
    this.buttonsChanged // eslint-disable-line
    const bi = this.page.buttons.indexOf(button)
    return bi > 0
  },

  canMoveButtonDown (button) {
    this.buttonsChanged // eslint-disable-line
    const bi = this.page.buttons.indexOf(button)
    return bi < (parseInt(this.numButtons) - 1)
  },

  moveButtonUp (button) {
    if (this.canMoveButtonUp(button)) {
      const bi = this.page.buttons.indexOf(button)
      this.page.buttons.splice(bi, 1)
      this.page.buttons.splice(bi - 1, 0, button)
      this.buttonsChanged = this.buttonsChanged + 1
    }
  },

  moveButtonDown (button) {
    if (this.canMoveButtonDown(button)) {
      const bi = this.page.buttons.indexOf(button)
      this.page.buttons.splice(bi, 1)
      this.page.buttons.splice(bi + 1, 0, button)
      this.buttonsChanged = this.buttonsChanged + 1
    }
  },

  newObservableBool (tf = false) {
    return new DefineMap({ value: tf })
  },
  toggleBool (observableBool) {
    observableBool.value = !observableBool.value
  },

  validVarName (newValue) {
    return (!newValue) || (!!this.appState.guide.vars[newValue.toLowerCase()])
  },

  newObservableProxy (obj, key) {
    return new ObservableProxy({ obj, key })
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
        vm.buttonsChanged = vm.buttonsChanged + 1
      }
    })
  },

  get observableButtons () {
    // bind to the length / update when it changes
    this.numButtons // eslint-disable-line
    this.buttonsChanged // eslint-disable-line
    return new DefineList(this.page.buttons || [])
  },

  get showMessageInputForButton () {
    this.buttonsChanged // eslint-disable-line
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

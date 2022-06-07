// import $ from 'jquery'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './page-fields.stache'
import constants from 'a2jauthor/src/models/constants'
import { ckeFactory } from '../../helpers/helpers'
import { TField } from '~/legacy/viewer/A2J_Types'

// O(1) field type constant VM prop maps
const canRequire = {
  radio: false,
  [constants.ftCheckBoxNOTA]: false,
  [constants.ftUserAvatar]: false
}
const canMinMax = {
  [constants.ftNumber]: true,
  [constants.ftNumberDollar]: true,
  [constants.ftNumberPick]: true,
  [constants.ftDateMDY]: true
}
const canList = {
  [constants.ftTextPick]: true
}
const canDefaultValue = {
  [constants.ftCheckBox]: false,
  [constants.ftCheckBoxNOTA]: false,
  [constants.ftGender]: false,
  [constants.ftUserAvatar]: false
}
const canOrder = {
  [constants.ftTextPick]: true,
  [constants.ftNumberPick]: true,
  [constants.ftDateMDY]: true
}
const canUseCalc = {
  [constants.ftNumber]: true,
  [constants.ftNumberDollar]: true
}
const canMaxChars = {
  [constants.ftText]: true,
  [constants.ftTextLong]: true,
  [constants.ftNumberPhone]: true,
  [constants.ftNumberZIP]: true,
  [constants.ftNumberSSN]: true
}
const canCalendar = {
  [constants.ftDateMDY]: true
}
const canUseSample = {
  [constants.ftText]: true,
  [constants.ftTextLong]: true,
  [constants.ftTextPick]: true,
  [constants.ftNumberPick]: true,
  [constants.ftNumber]: true,
  [constants.ftNumberZIP]: true,
  [constants.ftNumberSSN]: true,
  [constants.ftNumberDollar]: true,
  [constants.ftDateMDY]: true
}
const forceRequired = {
  radio: true,
  [constants.ftCheckBoxNOTA]: true
}
/* eslint-disable no-multi-spaces */
const fieldTypes = new DefineList([
  { value: constants.ftText,         label: 'Text' },
  { value: constants.ftTextLong,     label: 'Text (Long)' },
  { value: constants.ftTextPick,     label: 'Text (Pick from list)' },
  { value: constants.ftNumber,       label: 'Number' },
  { value: constants.ftNumberDollar, label: 'Number Dollar' },
  { value: constants.ftNumberSSN,    label: 'Number SSN' },
  { value: constants.ftNumberPhone,  label: 'Number Phone' },
  { value: constants.ftNumberZIP,    label: 'Number ZIP Code' },
  { value: constants.ftNumberPick,   label: 'Number (Pick from list)' },
  { value: constants.ftDateMDY,      label: 'Date MM/DD/YYYY' },
  { value: constants.ftGender,       label: 'Gender' },
  { value: constants.ftRadioButton,  label: 'Radio Button' },
  { value: constants.ftCheckBox,     label: 'Check box' },
  { value: constants.ftCheckBoxNOTA, label: 'Check Box (None of the Above)' },
  { value: constants.ftUserAvatar,   label: 'User Avatar' }
])
/* eslint-enable no-multi-spaces */

/* VM used for each field item, another VM used for the fields tab itself is below this */
export const FieldVM = DefineMap.extend('FieldVM', {
  field: {}, // A2J Types TField

  type: { // bindable proxy to TField type
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.field.type = val
        resolve(val)
      })
      resolve(this.field.type)
    }
  },

  types: {
    default: () => fieldTypes
  },

  required: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo('type', function (type, prevType) {
        if (forceRequired[this.type]) {
          this.field.required = true
          resolve(true)
        } else if (this.type === constants.ftUserAvatar) {
          this.field.required = false
          resolve(false)
        }
      })
      listenTo(lastSet, function (val) {
        this.field.required = !!val
        resolve(!!val)
      })
      resolve(this.field.required)
    }
  },

  calculator: {
    value ({ lastSet, listenTo, resolve }) {
      const vm = this
      const resolver = function (val) {
        if (canUseCalc[vm.type]) {
          vm.field.calculator = !!val
          resolve(!!val)
        } else {
          vm.field.calculator = false
          resolve(false)
        }
      }
      listenTo('type', function (type, prevType) {
        (!canUseCalc[this.type]) && resolver(false)
      })
      listenTo(lastSet, resolver)
      resolver(this.field.required)
    }
  },

  convertOptionsToText (optionsHTML) {
    let convertedList = ''
    if (optionsHTML) {
      const listSelect = document.createElement('select')
      listSelect.innerHTML = optionsHTML
      convertedList = [].map.call(listSelect.children, o => o.innerHTML.trim()).join('\n')
    }
    return convertedList
  },

  internalList: {
    value ({ lastSet, listenTo, resolve }) {
      const vm = this
      const resolver = val => {
        val = (val || '').replace(/^\s+|\s+$/gm, '')
        vm.field.previousTextList = val
        vm.field.listData = val && `<option>${val.replace(/[\r\n]+/g, '</option><option>')}</option>`
        resolve(val)
      }
      listenTo(lastSet, resolver)
      resolver(vm.field.previousTextList || vm.convertOptionsToText(vm.field.listData))
    }
  },

  get canRequire () {
    return canRequire[this.type] !== false
  },

  get canDefaultValue () {
    return canDefaultValue[this.type] !== false
  },

  get canMaxChars () {
    return canMaxChars[this.type] === true
  },

  get canUseCalc () {
    return canUseCalc[this.type] === true
  },

  get canMinMax () {
    return canMinMax[this.type] === true
  },

  get canList () {
    return canList[this.type] === true
  },

  get canUseSample () {
    return canUseSample[this.type] === true
  },

  get canOrder () { // unused
    return canOrder[this.type] === true
  },

  get canCalendar () { // unused
    return canCalendar[this.type] === true
  }
})

export const PageFieldsVM = DefineMap.extend('PageFieldsVM', {
  ckeFactory,

  guideFiles: {},

  page: {},
  appState: {},

  trim (el) {
    el.value = el.value.trim()
    return el.value
  },

  applyPattern (el) {
    el.value = el.value.match(new RegExp(el.pattern || '.', 'g')).join('')
    return el.value
  },

  get fields () {
    this.numFields // eslint-disable-line
    this.fieldsChanged // eslint-disable-line
    return new DefineList(this.page.fields.map(field => new FieldVM({ field })))
  },

  minFields: { default: 0 },
  maxFields: { default: constants.MAXFIELDS },

  numFields: {
    default: '0',
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        val = Math.min(Math.max(val, 0), this.maxFields)
        while (this.page.fields.length < val) {
          const blankField = new TField()
          blankField.type = constants.ftText
          blankField.label = 'Label'
          this.page.fields.push(blankField)
        }
        this.page.fields.length = val
        resolve(val + '')
      })
      resolve((this.page.fields.length || 0) + '')
    }
  },

  fieldsChanged: { type: 'number', default: 0 },

  get canRemove () {
    this.fieldsChanged // eslint-disable-line
    return parseInt(this.numFields) > this.minFields
  },

  get canAdd () {
    this.fieldsChanged // eslint-disable-line
    return parseInt(this.numFields) < this.maxFields
  },

  add (field) {
    if (this.canAdd) {
      this.numFields = (parseInt(this.numFields, 10) + 1) + ''
    }
  },

  remove (fieldVM) {
    if (this.canRemove) {
      const fi = this.page.fields.indexOf(fieldVM.field)
      this.page.fields.splice(fi, 1)
      this.numFields = (parseInt(this.numFields, 10) - 1) + ''
    }
  },

  canMoveUp (fieldVM) {
    this.numFields // eslint-disable-line
    this.fieldsChanged // eslint-disable-line
    const fi = this.page.fields.indexOf(fieldVM.field)
    return fi > 0
  },

  canMoveDown (fieldVM) {
    this.fieldsChanged // eslint-disable-line
    const fi = this.page.fields.indexOf(fieldVM.field)
    return fi < (parseInt(this.numFields) - 1)
  },

  moveUp (fieldVM) {
    if (this.canMoveUp(fieldVM)) {
      const fi = this.page.fields.indexOf(fieldVM.field)
      this.page.fields.splice(fi, 1)
      this.page.fields.splice(fi - 1, 0, fieldVM.field)
      this.fieldsChanged = this.fieldsChanged + 1
    }
  },

  moveDown (fieldVM) {
    if (this.canMoveDown(fieldVM)) {
      const fi = this.page.fields.indexOf(fieldVM.field)
      this.page.fields.splice(fi, 1)
      this.page.fields.splice(fi + 1, 0, fieldVM.field)
      this.fieldsChanged = this.fieldsChanged + 1
    }
  },

  get legacySection () {
    return window.buildFieldsFieldSet(this.page)
  }
})

export default Component.extend({
  tag: 'page-fields',
  view: template,
  leakScope: false,
  ViewModel: PageFieldsVM
})

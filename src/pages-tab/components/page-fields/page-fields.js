import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './page-fields.stache'
import constants from 'a2jauthor/src/models/constants'
import { ckeFactory } from '../../helpers/helpers'
import { TField } from '~/legacy/viewer/A2J_Types'
import * as pageFieldsHelpers from './page-fields-helpers'

/* VM used for each field item, another VM used for the fields tab itself is below this */
export const FieldVM = DefineMap.extend('FieldVM', {
  field: {}, // A2J Types TField
  vars: {}, // A2J Types TVariable[]

  // validate on this type change
  type: { // bindable proxy to TField type
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.field.type = val
        resolve(val)
      })
      resolve(this.field.type)
    }
  },

  name: { // bindable proxy to TField name
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.field.name = val
        resolve(val)
      })
      resolve(this.field.name)
    }
  },

  get expectedVarType () { // Text, Number, MC, TF ...
    return pageFieldsHelpers.getExpectedVarType(this.type)
  },

  get varType () { // Text, Number, MC, TF ...
    const varName = this.name.toLowerCase()
    const variable = varName && this.vars[varName]
    const varType = variable && variable.type.toLowerCase()

    return varType
  },

  get message () {
    const assignedVarType = this.varType ? this.varType.toLowerCase() : ''
    const expectedVarType = this.expectedVarType ? this.expectedVarType.toLowerCase() : ''

    return `Found Variable Type: (${assignedVarType}) but expected Variable Type: (${expectedVarType})`
  },

  get showMessage () {
    return this.expectedVarType.toLowerCase() !== this.varType
  },

  types: {
    default: () => pageFieldsHelpers.fieldTypes
  },

  required: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo('type', function (type, prevType) {
        if (pageFieldsHelpers.forceRequired[this.type]) {
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
        if (pageFieldsHelpers.canUseCalc[vm.type]) {
          vm.field.calculator = !!val
          resolve(!!val)
        } else {
          vm.field.calculator = false
          resolve(false)
        }
      }
      listenTo('type', function (type, prevType) {
        (!pageFieldsHelpers.canUseCalc[this.type]) && resolver(false)
      })
      listenTo(lastSet, resolver)
      resolver(this.field.calculator)
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
    return pageFieldsHelpers.canRequire[this.type] !== false
  },

  get canDefaultValue () {
    return pageFieldsHelpers.canDefaultValue[this.type] !== false
  },

  get canMaxChars () {
    return pageFieldsHelpers.canMaxChars[this.type] === true
  },

  get canUseCalc () {
    return pageFieldsHelpers.canUseCalc[this.type] === true
  },

  get canMinMax () {
    return pageFieldsHelpers.canMinMax[this.type] === true
  },

  get canList () {
    return pageFieldsHelpers.canList[this.type] === true
  },

  get canUseSample () {
    return pageFieldsHelpers.canUseSample[this.type] === true
  },

  get canOrder () { // unused
    return pageFieldsHelpers.canOrder[this.type] === true
  },

  get canCalendar () { // unused
    return pageFieldsHelpers.canCalendar[this.type] === true
  }
})

export const PageFieldsVM = DefineMap.extend('PageFieldsVM', {
  ckeFactory,

  page: {},
  appState: {},
  guideFiles: {},

  trim (el) {
    el.value = el.value.trim()
    return el.value
  },

  setBound (el) {
  },

  checktoToday (el) {
    return el.checked ? 'TODAY' : ''
  },

  parseDateBound (boundedDate) {
    let textDate = '' // assume unfilled

    if (boundedDate) {
      if (boundedDate !== 'TODAY') {
        textDate =
        boundedDate.substr(4) + '-' +
        boundedDate.substr(0, 2) + '-' +
        boundedDate.substr(2, 2)
      }
    }

    return textDate
  },

  toggleDateBoundEnable (el) {
    $(el).prop('disabled', !$(el).prop('disabled'))
  },

  mangleDateBound (el) {
    let str = el.value.split(',').join('')
    str = str.split('-').join('')
    console.log('JAWN: ' + str)

    str =
      str.substr(4, 2) + '/' +
      str.substr(6, 2) + '/' +
      str.substr(0, 4)

    str = str.match(new RegExp(el.pattern || '.', 'g')).join('')

    return str
  },

  applyPattern (el) {
    el.value = el.value.match(new RegExp(el.pattern || '.', 'g')).join('')
    return el.value
  },

  get vars () {
    return this.appState.guide.vars
  },

  get fields () {
    this.numFields // eslint-disable-line
    this.fieldsChanged // eslint-disable-line
    const vars = this.vars
    return new DefineList(this.page.fields.map(field => new FieldVM({ field, vars })))
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

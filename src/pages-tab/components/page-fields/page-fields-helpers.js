import constants from 'a2jauthor/src/models/constants'
import DefineList from 'can-define/list/list'

// O(1) field type constant VM prop maps
export const canRequire = {
  radio: false,
  [constants.ftCheckBoxNOTA]: false,
  [constants.ftUserAvatar]: false
}
export const canMinMax = {
  [constants.ftNumber]: true,
  [constants.ftNumberDollar]: true,
  [constants.ftNumberPick]: true,
  [constants.ftDateMDY]: true
}
export const canList = {
  [constants.ftTextPick]: true
}
export const canDefaultValue = {
  [constants.ftCheckBox]: false,
  [constants.ftCheckBoxNOTA]: false,
  [constants.ftGender]: false,
  [constants.ftUserAvatar]: false
}
export const canOrder = {
  [constants.ftTextPick]: true,
  [constants.ftNumberPick]: true,
  [constants.ftDateMDY]: true
}
export const canUseCalc = {
  [constants.ftNumber]: true,
  [constants.ftNumberDollar]: true
}
export const canMaxChars = {
  [constants.ftText]: true,
  [constants.ftTextLong]: true,
  [constants.ftNumberPhone]: true,
  [constants.ftNumberZIP]: true,
  [constants.ftNumberSSN]: true
}
export const canCalendar = {
  [constants.ftDateMDY]: true
}
export const canUseSample = {
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
export const forceRequired = {
  radio: true,
  [constants.ftCheckBoxNOTA]: true
}
/* eslint-disable no-multi-spaces */
export const fieldTypes = new DefineList([
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

const mapFieldToVariableType = {
  [constants.ftButton]: constants.vtText.toLowerCase(),
  [constants.ftText]: constants.vtText.toLowerCase(),
  [constants.ftTextLong]: constants.vtText.toLowerCase(),
  [constants.ftTextPick]: constants.vtText.toLowerCase(),
  [constants.ftNumber]: constants.vtNumber.toLowerCase(),
  [constants.ftNumberDollar]: constants.vtText.toLowerCase(),
  [constants.ftNumberSSN]: constants.vtText.toLowerCase(),
  [constants.ftNumberPhone]: constants.vtText.toLowerCase(),
  [constants.ftNumberZIP]: constants.vtText.toLowerCase(),
  [constants.ftNumberPick]: constants.vtNumber.toLowerCase(),
  [constants.ftDateMDY]: constants.vtDate.toLowerCase(),
  [constants.ftGender]: constants.vtMC.toLowerCase(),
  [constants.ftRace]: constants.vtText.toLowerCase(),
  [constants.ftRadioButton]: constants.vtMC.toLowerCase(),
  [constants.ftCheckBox]: constants.vtTF.toLowerCase(),
  [constants.ftCheckBoxNOTA]: constants.vtTF.toLowerCase(),
  [constants.ftCheckBoxMultiple]: constants.vtTF.toLowerCase(),
  [constants.ftUserAvatar]: constants.vtText.toLowerCase()
}

export const getExpectedVarType = (fieldType) => {
  return mapFieldToVariableType[fieldType]
}

export const hasValidVarType = (fieldType, variableType) => {
  if (!fieldType || !variableType) return false

  const expectedType = mapFieldToVariableType[fieldType.toLowerCase()]
  const hasValidTypes = expectedType === variableType.toLowerCase() // "Text", "TF"

  return hasValidTypes
}

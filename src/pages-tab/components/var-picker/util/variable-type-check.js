import constants from 'a2jauthor/src/models/constants'

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

export const variableTypeCheck = (fieldType, variableType) => {
  const expectedType = mapFieldToVariableType[fieldType.toLowerCase()]
  const hasValidTypes = expectedType === variableType.toLowerCase()
  console.log('hasValidTypes', hasValidTypes)
  return hasValidTypes
}

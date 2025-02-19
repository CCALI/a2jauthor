import DefineMap from 'can-define/map/map'
import { pageProps, fieldProps, buttonProps } from './propsLists'

const getRegEx = (varName, useExplicitSearch) => {
  const lowerCaseVarName = varName.toLowerCase()

  const parens = `\\(${lowerCaseVarName}\\)`
  const percent = `\\%${lowerCaseVarName}\\%`
  const brackets = `\\[${lowerCaseVarName}\\]`
  const noTrailingQuotes = `${lowerCaseVarName}(?!")`
  const implicitPrep = `(?<!")${lowerCaseVarName}`

  const implicitRegEx = new RegExp(`${implicitPrep}&${noTrailingQuotes}|${parens}|${percent}|${brackets}|${lowerCaseVarName}`, 'gi')
  const greedyRegEx = new RegExp(`${noTrailingQuotes}|${parens}|${percent}|${brackets}|${lowerCaseVarName}`, 'gi')

  return useExplicitSearch ? implicitRegEx : greedyRegEx
}

const getMatches = (page, regEx) => { // pages or fields or buttons
  const foundMatches = { page: [], fields: [], buttons: [] }
  // check top level page properties
  for (const entry of pageProps) {
    const prop = entry.key
    const testValue = page[prop]

    const matches = testValue.match(regEx)

    if (matches && matches.length) {
      foundMatches.page.push(entry.display)
    }
  }

  for (const field of page.fields) {
    for (const entry of fieldProps) {
      const prop = entry.key
      const testValue = field[prop]

      const matches = testValue.match(regEx)

      if (matches && matches.length) {
        foundMatches.fields.push(entry.display)
      }
    }
  }

  for (const button of page.buttons) {
    for (const entry of buttonProps) {
      const prop = entry.key
      const testValue = button[prop]

      const matches = testValue.match(regEx)

      if (matches && matches.length) {
        foundMatches.buttons.push(entry.display)
      }
    }
  }

  if (foundMatches.page.length || foundMatches.fields.length || foundMatches.buttons.length) {
    return foundMatches
  }
}

export const findVarUsage = (varName, pages, useExplicitSearch) => {
  const regEx = getRegEx(varName, useExplicitSearch)
  const matches = new DefineMap({})

  for (const page of pages) {
    const foundMatches = getMatches(page, regEx)

    if (foundMatches) {
      matches[page.name] = foundMatches
    }
  }

  return matches
}

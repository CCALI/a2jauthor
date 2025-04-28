import { lowerCase } from "lodash"

const pageProps = [
  { key: 'name', type: 'regex', display: 'Page Name' },
  { key: 'text', type: 'regex', display: 'Question Text' },
  { key: 'repeatVar', type: 'string', display: 'Counting Variable' },
  { key: 'outerLoopVar', type: 'string', display: 'Outer Loop Variable' },
  { key: 'learn', type: 'regex', display: 'LearnMore Prompt' },
  { key: 'help', type: 'regex', display: 'LearnMore Response' },
  { key: 'helpReader', type: 'regex', display: 'Video Transcript' },
  { key: 'codeBefore', type: 'logic', display: 'Before Logic' },
  { key: 'codeAfter', type: 'logic', display: 'After Logic' }
]
const fieldProps = [
  { key: 'label', type: 'regex', display: 'Field Label' },
  { key: 'name', type: 'string', display: 'Field Variable' },
  { key: 'value', type: 'regex', display: 'Field Default Value' },
  { key: 'invalidPrompt', type: 'regex', display: 'Field Custom Invalid Prompt' },
  { key: 'sample', type: 'regex', display: 'Field Sample Value' }
]
const buttonProps = [
  { key: 'label', type: 'regex', display: 'Button Label' },
  { key: 'name', type: 'string', display: 'Button Variable Name' },
  { key: 'value', type: 'regex', display: 'Button Default Value' },
  { key: 'repeatVar', type: 'string', display: 'Button Counting Variable' },
  { key: 'url', type: 'regex', display: 'Button URL' }
]

/*
All three tests greedy if explicitSearch = notTrue
Test 3 currently is explicit (testValue === lowerCaseVarName)
Make test 3 greedy

Rename three regex consts

-could simply be
  parenRegexString `^\\(\\s*${lowerCaseVarName}\\s*\\)$`
  percentRegexString `^\\%\\s*${lowerCaseVarName}\\s*\\%$`
  bracketRegexString `^\\[\\s*${lowerCaseVarName}\\s*\\]$`
  if explicitSearch === true, use search Regex with ^/$

*After above is done*
If explicit, find explicit matches
Either if/else or find Explicit function

const match = findMatches()
if (match) { add to where[] }

Type Match = {
pageName:  
location: 
foundCount: 
}

*/

export const findMacroMatches = (testValue, lowerCaseVarName, explicit) => {
  explicit = false;

  //For greedy search, Regex looks for lowerCaseVarName followed by any character 0+ times, then white space 0+ times, then the closing half of bracket, paren, percent
  const parenRegexString = `\\(\\s*${lowerCaseVarName}.*\\s*\\)`
  const percentRegexString = `\\%\\s*${lowerCaseVarName}.*\\s*\\%`
  const bracketRegexString = `\\[\\s*${lowerCaseVarName}.*\\s*\\]`

  //For explicit search, Regex ends with '$', meaning nothing can follow 
  const parenRegexStringX = `\\(\\s*${lowerCaseVarName}\\s*\\)`
  const percentRegexStringX = `\\%\\s*${lowerCaseVarName}\\s*\\%`
  const bracketRegexStringX = `\\[\\s*${lowerCaseVarName}\\s*\\]` 

  const regexString = `${parenRegexString}|${percentRegexString}|${bracketRegexString}`
  const regexStringX = `${parenRegexStringX}|${percentRegexStringX}|${bracketRegexStringX}`

  //Checks explicit and uses the appropriate regexString to make macroRegex
  const macroRegex = (explicit === false) ? new RegExp(regexString, 'ig'): new RegExp(regexStringX, 'ig')

  const matches = testValue.match(macroRegex)
  console.log(matches)
  return matches ? matches :[]
}

export const findLogicMatches = (testValue, lowerCaseVarName) => {
  const logicRegexString = `${lowerCaseVarName}`
  const logicRegex = new RegExp(logicRegexString, 'ig')

  const matches = testValue.match(logicRegex)
  
  return matches ? matches :[]
}

export const findLiteralMatches =(testValue, lowerCaseVarName) => {
  // finds variables assigned explicitly to buttons, fields, and counting variables
  const literalRegexString = `${lowerCaseVarName}`
  const literalRegex = new RegExp(literalRegexString, 'ig')

  const matches = testValue.match(literalRegex)
  
  return matches ? matches :[]
}

export const findMatches = (searchTarget, usageItem, varName) => {
  // skip check if not string value to check
  const prop = usageItem.key
  if (!searchTarget[prop]) { return }
  const testValue = searchTarget[prop].toLowerCase()
  const lowerCaseVarName = varName.toLowerCase()

  if (usageItem.type === 'regex') { // check for macro matches, `%%someVar%%`
    const found = findMacroMatches(testValue, lowerCaseVarName)
    if (found) {
      where.push(usageItem.display)
      console.log(where)
    }
  } else if (usageItem.type === 'logic') {
    const found = findLogicMatches(testValue, lowerCaseVarName)
    if (found) { // check for logic usage (no macro syntax, `set someVar to "foo"`)
      where.push(usageItem.display)
    }
  } else {
    const found = findLiteralMatches(testValue, lowerCaseVarName)
    if (found) { // check for varName itself, `someVar`
      where.push(usageItem.display)
    }
  }
}

export function vcGatherUsage (varName, explicitSearch) { // 2015-03-27 Search for variable or constant
  // alter below line to test two search methods
  explicitSearch = true
  let html = ''
  let count = 0
  let pageName

  for (pageName in window.gGuide.pages) { // Search text, buttons, help, fields and logic for variable name.
    /** @type TPage */
    let where = [] //  list where it's on this page
    const page = window.gGuide.pages[pageName]
    let pageMatches, fieldMatches, buttonMatches

    // check top level page properties
    for (const entry of pageProps) {
      pageMatches = findMatches(page, entry, varName)
      // populate where array here!
    }

    // check all page fields
    for (const field of page.fields) {
      for (const entry of fieldProps) {
        fieldMatches = findMatches(field, entry, varName)
      }
    }

    // check all buttons
    for (const button of page.buttons) {
      for (const entry of buttonProps) {
        buttonMatches = findMatches(button, entry, varName)
      }
    }
    where = [...where, ...pageMatches, ...fieldMatches, ...buttonMatches]

    if (where.length) { // If we found anything, we'll list the page and its location.
      count++
      html += ('<li>' + page.name + '</li><ul>' + '<li>' + where.join('<li>') + '</ul>')
    }
  }

  return 'Used in ' + count + ' pages' + '<ul>' + html + '</ul>'
}

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

-i believe this can be solved with .includes, maybe a
  if(testValue.includes(lowerCaseVarName)){
    where.push(usageItem.display)
  }

Rename three regex consts

-could simply be
  parenRegexString `^\\(\\s*${lowerCaseVarName}\\s*\\)$`
  percentRegexString `^\\%\\s*${lowerCaseVarName}\\s*\\%$`
  bracketRegexString `^\\[\\s*${lowerCaseVarName}\\s*\\]$`
  if explicitSearch === true, use search Regex with ^/$

*After above is done*
If explicit, find explicit matches
Either if/else or find Explicit function

*/

export const findMacroMatches = (testValue, varName) => {
  const lowerCaseVarName = varName.toLowerCase()
  const parenRegexString = `\\(\\s*${lowerCaseVarName}\\s*\\)`
  const percentRegexString = `\\%\\s*${lowerCaseVarName}\\s*\\%`
  const bracketRegexString = `\\[\\s*${lowerCaseVarName}\\s*\\]`
  const regexString = `${parenRegexString} | ${percentRegexString} | ${bracketRegexString}`
  const macroRegex = new RegExp(regexString, 'i')

  const matches = testValue.match(macroRegex)

  return matches
}

export const findMatches = (searchTarget, usageItem) => {
  // skip check if not string value to check
  const prop = usageItem.key
  if (!searchTarget[prop]) { return }
  const testValue = searchTarget[prop].toLowerCase()

  if (usageItem.type === 'regex') { // check for macro matches, `%%someVar%%`
    const matches = testValue.match(macroRegex)
    if (matches && matches.length) {
      where.push(usageItem.display)
    }
  } else if (usageItem.type === 'logic') {
    if (testValue.indexOf(lowerCaseVarName) !== -1) { // check for logic usage (no macro syntax, `set someVar to "foo"`)
      where.push(usageItem.display)
    }
  } else {
    if (testValue === lowerCaseVarName) { // check for varName itself, `someVar`
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
    const where = [] //  list where it's on this page
    const page = window.gGuide.pages[pageName]

    // check top level page properties
    for (const entry of pageProps) {
      findMatches(page, entry)
    }

    // check all page fields
    for (const field of page.fields) {
      for (const entry of fieldProps) {
        findMatches(field, entry)
      }
    }

    // check all buttons
    for (const button of page.buttons) {
      for (const entry of buttonProps) {
        findMatches(button, entry)
      }
    }

    if (where.length > 0) { // If we found anything, we'll list the page and its location.
      count++
      html += ('<li>' + page.name + '</li><ul>' + '<li>' + where.join('<li>') + '</ul>')
    }
  }

  return 'Used in ' + count + ' pages' + '<ul>' + html + '</ul>'
}

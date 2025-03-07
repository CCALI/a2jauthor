export function vcGatherUsage (varName) { // 2015-03-27 Search for variable or constant
  let html = ''
  let count = 0
  let pageName
  const lowerCaseVarName = varName.toLowerCase()
  const regexString = `\\(\\s*${lowerCaseVarName}\\s*\\)|\\%\\s*${lowerCaseVarName}\\s*\\%|\\[\\s*${lowerCaseVarName}\\s*\\]`
  const macroRegex = new RegExp(regexString, 'i')
  for (pageName in window.gGuide.pages) { // Search text, buttons, help, fields and logic for variable name.
    /** @type TPage */
    const where = [] //  list where it's on this page
    const page = window.gGuide.pages[pageName]

    const findMatches = (searchTarget, usageItem) => {
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

    // check top level page properties
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
    for (const entry of pageProps) {
      findMatches(page, entry)
    }

    // check all page fields
    const fieldProps = [
      { key: 'label', type: 'regex', display: 'Field Label' },
      { key: 'name', type: 'string', display: 'Field Variable' },
      { key: 'value', type: 'regex', display: 'Field Default Value' },
      { key: 'invalidPrompt', type: 'regex', display: 'Field Custom Invalid Prompt' },
      { key: 'sample', type: 'regex', display: 'Field Sample Value' }
    ]
    for (const field of page.fields) {
      for (const entry of fieldProps) {
        findMatches(field, entry)
      }
    }

    // check all buttons
    const buttonProps = [
      { key: 'label', type: 'regex', display: 'Button Label' },
      { key: 'name', type: 'string', display: 'Button Variable Name' },
      { key: 'value', type: 'regex', display: 'Button Default Value' },
      { key: 'repeatVar', type: 'string', display: 'Button Counting Variable' },
      { key: 'url', type: 'regex', display: 'Button URL' }
    ]
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

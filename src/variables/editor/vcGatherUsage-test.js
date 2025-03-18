import 'jquery'
import { assert } from 'chai'
import 'steal-mocha'
import { vcGatherUsage, findMacroMatches } from './vcGatherUsage'

describe('findMacroMatches', function () {
  it.only('returns matches based on A2J Macro Syntax', function () {
    const matches = findMacroMatches('Hello %%[Client First Name TE]%%, welcome to the interview!', 'Client First Name TE')
    const expectedResult = [ '[Client First Name TE]' ]
    console.log(matches)
    assert.deepEqual(matches, expectedResult, 'should find one match')
  })
})

//Copy above function for other two branches in findMatches, make fail, go from there


// describe('vcGatherUsage', function () {
//   let usageTestPage
//   const testProps = {
//     page: [
//       { key: 'name', type: 'regex', display: 'Page Name' },
//       { key: 'text', type: 'regex', display: 'Question Text' },
//       { key: 'repeatVar', type: 'string', display: 'Counting Variable' },
//       { key: 'outerLoopVar', type: 'string', display: 'Outer Loop Variable' },
//       { key: 'learn', type: 'regex', display: 'LearnMore Prompt' },
//       { key: 'help', type: 'regex', display: 'LearnMore Response' },
//       { key: 'helpReader', type: 'regex', display: 'Video Transcript' },
//       { key: 'codeBefore', type: 'logic', display: 'Before Logic' },
//       { key: 'codeAfter', type: 'logic', display: 'After Logic' }
//     ],
//     fields: [
//       { key: 'label', type: 'regex', display: 'Field Label' },
//       { key: 'name', type: 'string', display: 'Field Variable' },
//       { key: 'value', type: 'regex', display: 'Field Default Value' },
//       { key: 'invalidPrompt', type: 'regex', display: 'Field Custom Invalid Prompt' },
//       { key: 'sample', type: 'regex', display: 'Field Sample Value' }
//     ],
//     buttons: [
//       { key: 'label', type: 'regex', display: 'Button Label' },
//       { key: 'name', type: 'string', display: 'Button Variable Name' },
//       { key: 'value', type: 'regex', display: 'Button Default Value' },
//       { key: 'repeatVar', type: 'string', display: 'Button Counting Variable' },
//       { key: 'url', type: 'regex', display: 'Button URL' }
//     ]
//   }

//   beforeEach(() => {
//     usageTestPage = new window.TPage()
//     usageTestPage.fields = [new window.TField()]
//     usageTestPage.buttons = [new window.TButton()]

//     const gGuide = new window.TGuide()
//     window.gGuide = gGuide
//     window.gGuide.pages = { usageTestPage }
//   })

//   afterEach(() => {
//     window.gGuide = null
//   })

//   it('gathers usage on Page, Field, and Button level property values using variables', function () {
//     const setTestProps = (targetMap, propsToSet) => {
//       for (const entry of propsToSet) {
//         const prop = entry.key
//         if (entry.type === 'regex') {
//           targetMap[prop] = 'macro style %%[Number NU]%%'
//         } else if (entry.type === 'logic') {
//           targetMap[prop] = 'SET [Number NU] TO 1'
//         } else { // direct var set
//           targetMap[prop] = 'Number NU'
//         }
//       }
//     }
//     setTestProps(usageTestPage, testProps.page)
//     setTestProps(usageTestPage.fields[0], testProps.fields)
//     setTestProps(usageTestPage.buttons[0], testProps.buttons)

//     const foundMessage = vcGatherUsage('Number NU')
//     // if found, `display value` will be in foundMessage for each entry
//     for (const entry of testProps.page) {
//       const usedInPage = foundMessage.indexOf(entry.display) !== -1
//       assert.isTrue(usedInPage, `should find Number NU usage in page.${entry.key} by displaying ${entry.display} in returned foundMessage html`)
//     }
//     for (const entry of testProps.fields) {
//       const usedInField = foundMessage.indexOf(entry.display) !== -1
//       assert.isTrue(usedInField, `should find Number NU usage in field.${entry.key} by displaying ${entry.display} in returned foundMessage html`)
//     }
//     for (const entry of testProps.buttons) {
//       const usedInButton = foundMessage.indexOf(entry.display) !== -1
//       assert.isTrue(usedInButton, `should find Number NU usage in button.${entry.key} by displaying ${entry.display} in returned foundMessage html`)
//     }
//   })

//   it('gathers explicit usage on Page, Field, and Button level property values using variables', function () {
//     const setTestProps = (targetMap, propsToSet) => {
//       for (const entry of propsToSet) {
//         const prop = entry.key
//         if (entry.type === 'regex') {
//           targetMap[prop] = 'macro style %%[Number NU]%%'
//         } else if (entry.type === 'logic') {
//           targetMap[prop] = 'SET [Number123 NU] TO 1'
//         } else { // direct var set
//           targetMap[prop] = 'Number foo NU'
//         }
//       }
//     }
//     setTestProps(usageTestPage, testProps.page)
//     setTestProps(usageTestPage.fields[0], testProps.fields)
//     setTestProps(usageTestPage.buttons[0], testProps.buttons)

//     const foundMessage = vcGatherUsage('Number NU')
//     // if found, `display value` will be in foundMessage for each entry
//     for (const entry of testProps.page) {
//       const usedInPage = foundMessage.indexOf(entry.display) !== -1
//       assert.isTrue(usedInPage, `should find Number NU usage in page.${entry.key} by displaying ${entry.display} in returned foundMessage html`)
//     }
//     for (const entry of testProps.fields) {
//       const usedInField = foundMessage.indexOf(entry.display) !== -1
//       assert.isTrue(usedInField, `should find Number NU usage in field.${entry.key} by displaying ${entry.display} in returned foundMessage html`)
//     }
//     for (const entry of testProps.buttons) {
//       const usedInButton = foundMessage.indexOf(entry.display) !== -1
//       assert.isTrue(usedInButton, `should find Number NU usage in button.${entry.key} by displaying ${entry.display} in returned foundMessage html`)
//     }
//   })
// })

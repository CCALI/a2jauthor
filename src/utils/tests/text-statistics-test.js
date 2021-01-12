import { assert } from 'chai'
import TextStatistics from '../text-statistics'

import 'steal-mocha'

describe('text-statistics util', function () {
  let testContent
  let result
  const textStatistics = new TextStatistics()

  afterEach(() => {
    document.getElementById('test-area').innerHTML = ''
  })

  it('cleanText - html and line breaks', () => {
    /* eslint-disable no-irregular-whitespace */
    testContent = `<p><strong>Welcome!</strong> This interview will help you complete a <strong> Complaint for Absolute Divorce </strong>for use in the<strong> Superior Court of the District of Columbia.</strong></p>

    <p> </p>

    <p>By answering the following questions, you will be able to create a document you can print and file with the Court.</p>

    <p> </p>

    <p>Please click the <em>Continue</em> button below to see the next screen.</p>`

    const expectedResult = `Welcome. This interview will help you complete a  Complaint for Absolute Divorce for use in the Superior Court of the District of Columbia.
     

    By answering the following questions, you will be able to create a document you can print and file with the Court.

     

    Please click the Continue button below to see the next screen.`

    assert.equal(expectedResult, textStatistics.cleanText(testContent), 'should clean up html tags')
  })

  it('wordCount', () => {
    testContent = `Welcome to the future!`
    result = textStatistics.wordCount(testContent)
    assert.equal(result, 4, 'should count words accurately for a single sentence')

    testContent = `Welcome to the future! It's 10,000 times cooler than you thought, right?`
    result = textStatistics.wordCount(testContent)
    assert.equal(result, 12, 'should count words accurately for multi sentences')

    testContent = `Welcome! This interview will help you complete a Complaint for Absolute Divorce for use in the Superior Court of the District of Columbia.

    By answering the following questions, you will be able to create a document you can print and file with the Court.
    Please click the Continue button below to see the next screen.`
    result = textStatistics.wordCount(testContent)
    assert.equal(result, 55, 'should count words accurately for paragraphs with soft and hard returns and line breaks')
  })

  it('sentenceCount', () => {
    testContent = `Are you using the Chrome browser?`
    result = textStatistics.sentenceCount(testContent)
    assert.equal(result, 1, 'should not double a single sentence with punctuation')

    testContent = testContent + ' And now we should have 2 sentences?'
    result = textStatistics.sentenceCount(testContent)
    assert.equal(result, 2, 'should count multiple')

    testContent = `Welcome! This interview will help you complete a Complaint for Absolute Divorce for use in the Superior Court of the District of Columbia.

    By answering the following questions, you will be able to create a document you can print and file with the Court.
    Please click the Continue button below to see the next screen.`
    result = textStatistics.sentenceCount(testContent)
    assert.equal(result, 4, 'should correctly count sentences, even with hard returns')
  })

  it('avg words/sentence', () => {
    testContent = `Welcome! This interview will help you complete a Complaint for Absolute Divorce for use in the Superior Court of the District of Columbia.

    By answering the following questions, you will be able to create a document you can print and file with the Court.
    Please click the Continue button below to see the next screen.`

    result = textStatistics.averageWordsPerSentence(testContent)

    assert.equal(result, 13.75, 'should compute avg words/sentence correctly to two decimal places')
  })

  it('fleschKincaidGradeLevel', () => {
    result = textStatistics.fleschKincaidGradeLevel(testContent)
    testContent = `Welcome! This interview will help you complete a Complaint for Absolute Divorce for use in the Superior Court of the District of Columbia.

    By answering the following questions, you will be able to create a document you can print and file with the Court.
    Please click the Continue button below to see the next screen.`

    assert.equal(result, 7.4, 'should compute approx grade level to one decimal place')
  })

  it('colemanLiauIndex', () => {
    result = textStatistics.colemanLiauIndex(testContent)
    testContent = `Welcome! This interview will help you complete a Complaint for Absolute Divorce for use in the Superior Court of the District of Columbia.

    By answering the following questions, you will be able to create a document you can print and file with the Court.
    Please click the Continue button below to see the next screen.`

    assert.equal(result, 9.5, 'should compute grade level/index to one decimal place')
  })
})

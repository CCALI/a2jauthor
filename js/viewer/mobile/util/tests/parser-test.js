import assert from 'assert';
import Parser from 'viewer/mobile/util/parser';
import partialJSON from 'viewer/models/fixtures/partial.json';
import partialXML from 'viewer/models/fixtures/partial.anx!text';
import interviewJSON from 'viewer/models/fixtures/interview.json';
import answersJSON from 'viewer/models/fixtures/inclusive_answers.json';
import answersXML from 'viewer/models/fixtures/inclusive_answers.xml!text';

// These correspond to an interview that has repeating variables
import answersWithRepeating from './fixtures/answers-with-repeating-values.json';
import pagesWithRepeating from './fixtures/interview-pages-with-repeating-vars.json';
import answersXMLWithRepeating from './fixtures/answers-file-with-repeating-values.anx!text';

import 'steal-mocha';

describe('Parser', function() {
  it('generates answers file correctly with repeating values', function() {
    const pages = pagesWithRepeating;
    const answers = answersWithRepeating;
    const expectedXML = answersXMLWithRepeating;

    const parsedXML = Parser.parseANX(answers, pages);
    assert.equal(parsedXML, expectedXML.trim(), 'generated xml is wrong');
  });

  it('generates hot docs answers file correctly', function() {
    let variables = answersJSON;
    let expectedXML = answersXML;
    let pages = interviewJSON.pages;

    let parsedXML = Parser.parseANX(variables, pages);
    assert.equal(parsedXML, expectedXML.trim(), 'generated xml is wrong');
  });

  it('parses hot docs answers file correctly', function() {
    let answersXML = partialXML;
    let expectedAnswers = partialJSON;
    let parsedAnswers = Parser.parseJSON(answersXML);

    assert.deepEqual(parsedAnswers, expectedAnswers, 'generated answers is wrong');
  });
});

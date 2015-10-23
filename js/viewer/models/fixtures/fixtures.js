import fixture from 'can/util/fixture/';
import _extend from 'lodash/object/extend';
import realInterviewJSON from './real_interview_1.json';
import parseModelInterviewJSON from './parse-model-interview.json';

fixture('GET /interview.json', function(req, res) {
  res(_extend({}, realInterviewJSON));
});

fixture('GET /parse-model-interview.json', function(req, res) {
  res(_extend({}, parseModelInterviewJSON));
});

fixture('GET /options', function(req, res) {
  res(200, 'success', '<OPTION VALUE=\"Illinois\">Illinois</OPTION><OPTION VALUE=\"Indiana\">Indiana</OPTION><OPTION VALUE=\"Minnesota\">Minnesota</OPTION><OPTION VALUE=\"Texas\">Texas</OPTION><OPTION VALUE=\"Wyoming\">Wyoming</OPTION>');
});

fixture('POST /autosave.aspx', function(req, res) {
  res(200, 'success', '');
});

fixture('POST /save.aspx', function(req, res) {
  res(200, 'success', 'http://google.com');
});

fixture('GET /resume.aspx', 'fixtures/partial.anx');

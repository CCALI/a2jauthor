import $ from 'jquery';
import assert from 'assert';
import Parser from 'client/util/parser';

import 'steal-mocha';

describe('Parser', function() {

  let fixturesBase = '../models/fixtures';

  // 2015-01-12 SJG Fails in Pre Windows 7 in all browsers???
  it('toANX', function() {
    let jsonDfd = $.get(fixturesBase + '/inclusive_answers.json');

    let xmlDfd = $.ajax({
      url: fixturesBase + '/inclusive_answers.xml',
      dataType: 'text'
    });

    let interviewDfd = $.get(fixturesBase + '/interview.json');

    let onSuccess = function(json, xml, interview) {
      json = json[0];
      xml = xml[0];
      interview = interview[0];

      let anx = Parser.parseANX(json, interview.pages);
      assert.equal(anx, xml.trim(), 'anx file correctly parsed');
    };

    return $.when(jsonDfd, xmlDfd, interviewDfd).done(onSuccess);
  });

  // 2015-01-12 SJG Fails in Pre Windows 7 in all browsers???
  it('toANX', function() {
    let jsonDfd = $.get(fixturesBase + '/inclusive_answers.json');

    let xmlDfd = $.ajax({
      url: fixturesBase + '/inclusive_answers.xml',
      dataType: 'text'
    });

    let interviewDfd = $.get(fixturesBase + '/interview.json');

    let onSuccess = function(json, xml, interview) {
      json = json[0];
      xml = xml[0];
      interview = interview[0];

      let anx = Parser.parseANX(json, interview.pages);
      assert.equal(anx, xml.trim(), 'anx file correctly parsed');
    };

    return $.when(jsonDfd, xmlDfd, interviewDfd).done(onSuccess);
  });

  it('toJSON', function() {
    let jsonDfd = $.get(fixturesBase + '/partial.json');

    let xmlDfd = $.ajax({
      url: fixturesBase + '/partial.anx',
      dataType: 'text'
    });

    let onSuccess = function(json, xml) {
      json = json[0];
      xml = xml[0];

      var o = Parser.parseJSON(xml);
      assert.deepEqual(o, json, 'json correctly parsed');
    };

    return $.when(jsonDfd, xmlDfd).done(onSuccess);
  });

});

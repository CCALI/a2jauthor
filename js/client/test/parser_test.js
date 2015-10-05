define(['jquery', 'util/parser'], function($, Parser) {

	module('parser');

	// 2015-01-12 SJG Fails in Pre Windows 7 in all browsers???
	QUnit.skip('toANX', function() {
		stop();

		var jsonDfd = $.get('../fixtures/inclusive_answers.json'),
		xmlDfd = $.ajax({
			url: '../fixtures/inclusive_answers.xml',
			dataType: 'text'
		}),
		interviewDfd = $.get('../fixtures/interview.json');

		$.when(jsonDfd, xmlDfd, interviewDfd)
		.done(function(json, xml, interview) {
			json = json[0];
			xml = xml[0];
			interview = interview[0];

			var anx = Parser.parseANX(json, interview.pages);
			equal(anx, xml.trim(), 'anx file correctly parsed');

			start();
		});
	});

	test('toJSON', function() {
		stop();

		var jsonDfd = $.get('../fixtures/partial.json'),
		xmlDfd = $.ajax({
			url: '../fixtures/partial.anx',
			dataType: 'text'
		});

		$.when(jsonDfd, xmlDfd).done(function(json, xml) {
			json = json[0];
			xml = xml[0];

			var o = Parser.parseJSON(xml);
			deepEqual(o, json, 'json correctly parsed');

			start();
		});
	});

});
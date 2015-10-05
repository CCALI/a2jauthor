define(['util/lang'], function(Lang) {

	module('lang');

	test('english default setup', function() {
		var lang = new Lang();

		equal(lang.attr('Continue'), 'Continue', 'lang map setup correctly');
	});

	test('korean setup', function() {
		var lang = new Lang('ko');

		equal(lang.attr('Continue'), '계속', 'lang map setup correctly');
	});

});
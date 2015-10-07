define(['can',
	'util/tlogic',
	'util/infinite',
	'util/regex',
	'models/constants',
	'util/string',
	'can/map/define'],

function(can,
	tLogic,
	Infinite,
	regex,
	constants,
	cString) {

	var Logic = can.Map.extend({
		define: {
			gotoPage: {
				get: function() {
					return this._tLogic.GOTOPAGE;
				},

				set: function(val) {
					this._tLogic.GOTOPAGE = val;
				}
			},

			infinite: {
				Type: Infinite,
				Value: Infinite
			}
		},

		init: function() {
			var guide = this.attr('interview').createGuide(),
			stringMethods = ['decodeEntities', 'htmlEscape', 'jsDate2days',
				'today2jsDate', 'mdy2jsDate', 'days2jsDate', 'ismdy', 'jquote'],
			traceMethods = ['traceTag'],
			methods = [guide, regex, constants];

			can.each(stringMethods, function(fn) {
				methods.push(can.proxy(cString[fn], cString));
			});

			can.each(traceMethods, function(fn) {
				methods.push(function() {});
			});

			this._tLogic = tLogic.apply(this, methods);
			//TODO: This exposure is due to creating a function on the fly within
			//tlogic.js, line 539
			window.gLogic = this._tLogic;
		},

		eval: function(str) {
			var output = this._tLogic.evalLogicHTML(str);

			return output.html;
		},

		exec: function(cajascript) {
			return this._tLogic.executeScript(cajascript);
		}
	});

	return Logic;

});
define(['jquery',
	'can'],

function($, can) {

	var Filler = can.Control.extend({
		init: function() {
			this._calc();
		},

		_calc: function() {
			var offset = this.element.offset(),
			height = $(window).height() - offset.top;

			this.element.height(height);
		},

		'{window} resize': function() {
			this._calc();
		}
	});

	/*
	Expose an additional html attr for easy access
	 */
	can.view.attr('filler', function(el, data) {
		new Filler(el);
	});

	return Filler;

});
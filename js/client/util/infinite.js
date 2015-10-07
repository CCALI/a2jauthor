define(['can', 'can/map/define', 'can/map/validations'], function(can) {

	var Infinite = can.Map.extend({
		init: function() {
			this.validateRangeOf(['_counter'], 0, 100);
		}
	}, {
		define: {
			_counter: {
				type: 'number',
				value: 0
			}
		},

		inc: function() {
			this.attr('_counter', this.attr('_counter') + 1);
		},

		reset: function() {
			this.attr('_counter', 0);
		}
	});

	return Infinite;

});
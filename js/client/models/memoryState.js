define(['can', 'can/map/define'], function(can) {

	var MemoryState = can.Map.extend({
		define: {
			showCredits: {
				value: false
			},

			templateURL: {
				set: function(val) {
					val = val.replace(/\.xml/, '.json');
					return val;
				}
			}
		}
	});

	return MemoryState;

});
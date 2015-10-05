define(['can',
	'lodash',
	'moment',
	'can/map/define'], function(can, _, moment) {

	var Config = can.Map.extend({
		define: {
			maxChars: {
				type: 'number'
			},
			min: {
				type: function(val) {
					if(this.attr('type') === 'datemdy') {
						return moment(val, 'MM/DD/YYYY').toDate();
					}

					return +val;
				}
			},
			max: {
				type: function(val) {
					if(this.attr('type') === 'datemdy') {
						return moment(val, 'MM/DD/YYYY').toDate();
					}

					return +val;
				}
			},
			required: {
				type: 'boolean'
			}
		}
	});

	return can.Map.extend({
		define: {
			config: {
				Type: Config,
				Value: Config
			},

			val: {
				set: function(val) {
					if(this.attr('config.type') === 'datemdy') {
						return moment(val, 'YYYY-MM-DD').toDate();
					}

					return val;
				}
			}
		},

		required: function() {
			if(this.config.required
				&& (_.isNull(this.val)
							|| _.isUndefined(this.val)
							|| (typeof this.val === 'string' && !this.val.length))) {
				return true;
			}
		},
		maxChars: function() {
			if(this.config.maxChars
				&& this.val && this.val.length > this.config.maxChars) {
				return true;
			}
		},
		min: function() {
			if(this.config.min
				&& this.val && this.val < this.config.min) {
				return true;
			}
		},
		max: function() {
			if(this.config.max
				&& this.val && this.val > this.config.max) {
				return true;
			}
		}
	});

	return Validations; 

});
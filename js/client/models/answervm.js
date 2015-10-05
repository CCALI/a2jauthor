define(['can',
	'lodash',
	'moment',
	'util/validations',
	'can/map/define',
	'can/map/validations'],

function(can, _, moment, V) {

	var AnswerViewModel = can.Map.extend({
		init: function() {
			this.validate('values', function(val) {
				var field = this.attr('field');
				if(!field) return;

				var validations = new V({
					config: {
						type: field.type,
						maxChars: field.maxChars,
						min: field.min,
						max: field.max,
						required: field.required
					}
				});

				validations.attr('val', val);

				switch(field.type) {
					case 'text':
					case 'textlong':
					case 'numberphone':
						return validations.required() || validations.maxChars();
						break;
					case 'numberssn':
						return validations.required();
						break;
					case 'numberzip':
						return validations.required() || validations.maxChars();
						break;
					case 'numberpick':
					case 'numberdollar':
						return validations.required() || validations.min() || validations.max();
						break;
					case 'gender':
						return validations.required();
						break;
					case 'datemdy':
						return validations.required() || validations.min() || validations.max();
						break;
					case 'checkbox':
					case 'radio':
					case 'checkboxNOTA':
						var fields = this.attr('field').page.attr('fields'),
						self = this;

						fields = _.filter(fields, function(f) {
							if(field.type === 'checkbox' || field.type === 'checkboxNOTA') {
								return f.type === 'checkbox' || f.type === 'checkboxNOTA';
							}

							return f.type === field.type;
						});

						var v = _.reduce(fields, function(v, field) {
							var answer = field.attr('answer.values.' + self.attr('answerIndex'));

							return val || v || !!answer;
						}, !!fields[0].attr('answer.values.' + self.attr('answerIndex')));

						validations.attr('val', v || null);

						return validations.required();
						break;
				}
			});
		}
	}, {
		field: null,
		answer: null,
		answerIndex: 1,
		define: {
			values: {
				get: function() {
					var type = this.attr('field.type'),
					raw = this.attr('answer.values.' + this.attr('answerIndex'));

					if(type === 'datemdy') {
						return raw ? moment(raw, 'MM/DD/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
					}

					return raw;
				},
				set: function(val) {
					var index = this.attr('answerIndex'),
					type = this.attr('field.type');

					if(type === 'datemdy') {
						val = moment(val, 'YYYY-MM-DD').format('MM/DD/YYYY');
					}

					if(!this.attr('answer.values')) {
						this.attr('answer.values', [null]);
					}

					this.attr('answer.values.' + index, val);
				}
			}
		}
	});

	return AnswerViewModel;
});
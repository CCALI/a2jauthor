define(['can',
		'moment',

		'text!components/pages/fields/field/init.stache',
		'text!components/pages/fields/field/views/text.stache',
		'text!components/pages/fields/field/views/gender.stache',
		'text!components/pages/fields/field/views/datemdy.stache',
		'text!components/pages/fields/field/views/numberphone.stache',
		'text!components/pages/fields/field/views/numberssn.stache',
		'text!components/pages/fields/field/views/numberdollar.stache',
		'text!components/pages/fields/field/views/textlong.stache',
		'text!components/pages/fields/field/views/radio.stache',
		'text!components/pages/fields/field/views/checkbox.stache',
		'text!components/pages/fields/field/views/checkboxNOTA.stache',
		'text!components/pages/fields/field/views/numberpick.stache',
		'text!components/pages/fields/field/views/textpick.stache',
		'text!components/pages/fields/field/views/numberzip.stache',

		'can/view/stache'
	],

	function(can, moment,
		init, text, gender, datemdy, numberphone,
		numberssn, numberdollar, textlong, radio,
		checkbox, checkboxNOTA, numberpick, textpick, numberzip) {

		var views = {
			text: can.stache(text),
			gender: can.stache(gender),
			datemdy: can.stache(datemdy),
			numberphone: can.stache(numberphone),
			numberssn: can.stache(numberssn),
			numberdollar: can.stache(numberdollar),
			textlong: can.stache(textlong),
			radio: can.stache(radio),
			checkbox: can.stache(checkbox),
			checkboxNOTA: can.stache(checkboxNOTA),
			numberpick: can.stache(numberpick),
			textpick: can.stache(textpick),
			numberzip: can.stache(numberzip)
		};

		can.Component.extend({
			tag: 'a2j-field',
			template: can.stache(init),
			scope: {
				update: function(ctx, el, ev) {
					this.attr('field._answer.values', el.val());
				}
			},
			helpers: {
				selector: function(type, options) {
					type = typeof type === 'function' ? type() : type;

					var self = this;
					//TODO: CanJS should allow for passing helpers as well as scope.
					//This below is a copy of screenManager's eval helper.
					return views[type](options.scope, {
						eval: function(str) {
							str = typeof str === 'function' ? str() : str;

							return self.attr('logic').eval(str);
						},

						prompt: function(options) {
							if(self.attr('hasError') && this.attr('field.invalidPrompt')) {
								return options.fn();
							}
						},

						selectnum: function(options) {
							var result = [],
							min = this.attr('field.min'),
							max = this.attr('field.max');

							for(var i = min; i <= max; i++) {
								result.push(options.fn(options.scope.add({
									'@index': i
								}).add(i)));
							}

							return result;
						},

						dateformat: function(val, format, options) {
							var val = typeof val === 'function' ? val() : val,
							format = typeof format === 'function' ? format() : format;

							return val ? moment(val, 'MM/DD/YYYY').format(format) : val;
						},

						i11n: function(key) {
							key = typeof key === 'function' ? key() : key;
							return this.attr('lang.' + key);
						}
					});
				}
			},
			events: {
				'{field._answer} change': function(ans, ev) {
					this.scope.attr('hasError', !!ans.errors());
				}
			}
		});

	});

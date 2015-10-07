define(['can', 'util/validations'],
function(can, Validations) {

	module('validations', {
		setup: function() {
			this.validations = new Validations();
		}
	});

	test('empty config', function() {
		var invalid = this.validations.required()
			|| this.validations.maxChars()
			|| this.validations.min()
			|| this.validations.max();

		ok(!invalid, 'empty config attrs are ignored');
	});

	module('validations:required', {
		setup: function() {
			this.validations = new Validations({
				config: {
					required: true
				}
			});
		}
	});

	test('simple', function() {
		this.validations.attr('val', '');
		ok(this.validations.required(), 'val is invalid');

		this.validations.attr('val', 'foo');
		ok(!this.validations.required(), 'val is valid');
	});

	test('null/undefined', function() {
		ok(this.validations.required(), 'val is invalid');

		this.validations.attr('val', null);
		ok(this.validations.required(), 'val is invalid');
	});

	test('object val', function() {
		ok(this.validations.required(), 'val is invalid');

		this.validations.attr('val', {});
		ok(!this.validations.required(), 'val is valid');
	});

	module('validations:maxChars', {
		setup: function() {
			this.validations = new Validations({
				config: {
					maxChars: 1
				}
			});
		}
	});

	test('simple', function() {
		this.validations.attr('val', 'f');
		ok(!this.validations.maxChars(), 'valid');

		this.validations.attr('val', 'foo');
		ok(this.validations.maxChars(), 'invalid');
	});

	module('validations:min', {
		setup: function() {
			this.validations = new Validations();
		}
	});

	test('number', function() {
		this.validations.attr('config.min', 10);
		this.validations.attr('val', 10);
		ok(!this.validations.min(), 'valid');

		this.validations.attr('val', 9);
		ok(this.validations.min(), 'invalid');
	});

	test('date:min', function() {
		this.validations.attr('config.type', 'datemdy');
		this.validations.attr('config.min', '12/01/2014');
		this.validations.attr('val', '2014-12-01');
		ok(!this.validations.min(), 'valid');

		this.validations.attr('val', '2014-11-30');
		ok(this.validations.min(), 'invalid');
	});

	test('date:max', function() {
		this.validations.attr('config.type', 'datemdy');
		this.validations.attr('config.max', '12/31/2014');
		this.validations.attr('val', '2014-12-31');
		ok(!this.validations.max(), 'valid');

		this.validations.attr('val', '2015-01-01');
		ok(this.validations.max(), 'invalid');
	});

});
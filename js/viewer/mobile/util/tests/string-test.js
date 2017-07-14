import assert from 'assert';
import cString from 'viewer/mobile/util/string';

describe('util: string', function() {

	describe('isNumber', function() {
		it('Returns true if given a number value', function(){
			let isNumber = cString.isNumber(42);
			assert.equal(isNumber, true);
		});

		it('Returns true if given a number as a string', function(){
			let isNumber = cString.isNumber("42");
			assert.equal(isNumber, true);
		});

		it('Returns false if given a non-number string value', function(){
			let isNumber = cString.isNumber("SallyForth");
			assert.equal(isNumber, false);
		});

		it('Returns false if testing against NaN', function(){
			let isNumber = cString.isNumber(NaN);
			assert.equal(isNumber, false);
		});

	});
});

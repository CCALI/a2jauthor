import assert from 'assert';
import Tlogic from 'viewer/mobile/util/tlogic';

let testLogic = new Tlogic();

describe('Tlogic', function() {

	it('SUM returns passed value if one param', function() {
		let totalValue = testLogic._CF("SUM", 22);
		assert.equal(totalValue, 22);
	});

	it('SUM returns the total of an array of values', function() {
		let totalValue = testLogic._CF("SUM", 22, 18, 10);
		assert.equal(totalValue, 50);
	});

	it('SUM handles string numbers', function() {
		let totalValue = testLogic._CF("SUM", "8", 4, "32");
		assert.equal(totalValue, 44);
	});

	it('SUM ignores non-number values', function() {
		let totalValue = testLogic._CF("SUM", "8", 4, "blue");
		assert.equal(totalValue, 12);
	});

});

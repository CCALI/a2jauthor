import assert from 'assert';
import Tlogic from 'viewer/mobile/util/tlogic';

let testLogic = new Tlogic();

describe('Tlogic', function() {

	it('SUM converts readableList display string and totals values', function() {
		let totalValue = testLogic._CF("SUM", "100, 200 and 300");
		assert.equal(totalValue, 600);
	});

	it('SUM ignores non-number values in the readableList', function() {
		let totalValue = testLogic._CF("SUM", "blue, 4, 8 and 12");
		assert.equal(totalValue, 24);
	});

	it('SUM handles non string values, returning 0 by default', function() {
		let totalValue = testLogic._CF("SUM", null);
		assert.equal(totalValue, 0);
	});
});

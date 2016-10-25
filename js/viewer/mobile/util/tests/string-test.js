import assert from 'assert';
import cString from 'viewer/mobile/util/string';

describe('util: string', function() {

	describe('swapMonthAndDay', function() {

		it('Returns mm/dd/yyyy if given dd/mm/yyyy', function() {
			let usDate = '02/24/1980';
			let britDate = cString.swapMonthAndDay(usDate);
			assert.equal(britDate, '24/02/1980');
		});

		it('Returns dd/mm/yyyy if given mm/dd/yyyy', function() {
			let britDate = '17/04/1988';
			let usDate = cString.swapMonthAndDay(britDate);
			assert.equal(usDate, '04/17/1988');
		});
	});

});

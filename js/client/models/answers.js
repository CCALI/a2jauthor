define(['jquery',
	'can',
	'lodash',
	'models/constants',
	'util/string'],

function($, can, _, CONST, cString) {

	var readableList = function(list, lang) {
		// 2014-09-03 Return comma separated, optional 'and' for array.
		var items = [];

		for(var i in list) {
			// Remove null or blanks.
			var item = list[i];
			if (!(item === null || typeof item === 'undefined' || item === '')) {
				items.push(item);
			}
		}

		var text = items.pop();
		if(items.length > 0) {
			text = items.join(', ') + ' ' + lang.RepeatAnd + ' ' + text; 
		}

		return text;
	};

	var Answers = can.Model.extend({
		define: {
			lang: {
				serialize: function() {
					return;
				}
			}
		},

		varExists: function(prop) {
			prop = $.trim(prop).toLowerCase();

			var keys = can.Map.keys(this),
			key = _.find(keys, function(k) {
				return k.toLowerCase() === prop;
			});

			var v;

			if(key) {
				v = this.attr(key);

				if(!v.attr('values')) {
					v.attr('values', [null]);
				}
			}

			return typeof v === 'undefined' ? null : v;
		},

		varCreate: function(varName, varType, varRepeat, varComment) {
			this.attr(varName.toLowerCase(), {
				name: varName,
				repeating: varRepeat,
				type: varType,
				values: [null]
			});

			return this.attr(varName.toLowerCase());
		},

		varGet: function(varName, varIndex, opts) {
			var v = this.varExists(varName);

			if(!v) return undefined;

			if(typeof varIndex === 'undefined' || varIndex === null || varIndex === '') {
				if(v.repeating) {
					// Repeating variable without an index returns array of all values
					return readableList(v.values, this.attr('lang'));
				}

				varIndex = 1;
			}

			var val = v.values[varIndex]; 
			switch (v.type) {
				case CONST.vtNumber:
					if (opts && opts.num2num === true) {
						// For calculations for number to be number even if blank.
						val = cString.textToNumber(val);
					}
					break;
				case CONST.vtDate:
					if(opts && opts.date2num === true) {
						// For calculations like comparing dates or adding days we convert date to number,
						//  daysSince1970, like A2J 4.
						if(val !== '') {
							// 11/28/06 If date is blank DON'T convert to number.
							val = cString.jsDate2days(cString.mdy2jsDate(val));
						}
					}
					break;
				case CONST.vtText:
					if(opts && opts.date2num===true && cString.ismdy(val)) {
						// If it's a date type or looks like a date time, convert to number of days.
						val = cString.jsDate2days(cString.mdy2jsDate(val));
					}
					break;
				case CONST.vtTF:
					val = (val > 0) || (val === true) || (val === 'true');
					break;
			}

			return val;
		},

		varSet: function(varName, varVal, varIndex) {
			var guide = this;

			var v = this.varExists(varName);
			if(v === null) {
				// Create variable at runtime
				v = this.varCreate(varName, CONST.vtText,
					!((typeof varIndex === 'undefined') || (varIndex===null)
						|| (varIndex === '') || (varIndex === 0)), '');
			}

			if((typeof varIndex === 'undefined') || (varIndex === null) || (varIndex === '')) {
				varIndex = 0;
			}

			// Handle type conversion, like number to date.
			switch (v.attr('type')) {
				case CONST.vtDate:
					if(typeof varVal === 'number') {
						varVal = cString.jsDate2mdy(cString.days2jsDate(varVal));
					}
					break;
			}

			// Set value but only trace if the value actually is different. 
			if(varIndex === 0) {
				v.attr('values.1', varVal);
			}
			else {
				v.attr('values.' + varIndex, varVal);
			}
		}
	});

	return Answers;

});
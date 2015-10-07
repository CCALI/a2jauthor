define(['can',
	'util/tlang',
	'util/string'], function(can, TLang, cString) {

	var Lang = can.Map.extend({
		init: function(id) {
			var o = {};

			TLang(o, can.proxy(cString.makestr, cString)).set(id);
			this.attr(o);
		}
	});

	return Lang;

});
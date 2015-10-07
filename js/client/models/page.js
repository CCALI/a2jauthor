define(['can',
	'models/answer',
	'models/field',
	'lodash',
	'exports',
	'can/map/define'],
	function(can, Answer, Field, _, exports) {

		var Page = can.Map.extend({
			define: {
				fields: {
					set: function(list) {
						var self =  this;

						var fields = new Field.Field.List(list.forEach(function(f) {
							f.page = self;
						}));

						return fields;
					},
					Type: Field.Field.List
				}
			}
		});

		Page.List = Page.List.extend({
			find: function(name) {
				return _.find(this, function(page) {
					return page.attr('name') === name;
				});
			}
		});

		exports.Page = Page;

	});

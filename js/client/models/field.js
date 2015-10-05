define(['can',
	'models/answer',
	'exports',
	'can/map/define'],
	function(can, Answer, exports) {

		Field = can.Map({
			define: {
				answer: {
					get: function() {
						var answer = this.page.interview.attr('answers').attr(this.attr('name'));

						if(answer) {
							return answer;
						} else {
							answer = new Answer({
								name: this.attr('name').toLowerCase(),
								type: this.attr('type'),
								repeating: this.attr('repeating'),
								values: [null]
							});

							this.page.interview.attr('answers').attr(this.attr('name').toLowerCase(), answer);

							return answer;
						}
					}
				},

				options: {
					value: ''
				}
			},

			getOptions: function() {
				var dfd = new can.Deferred(),
				self = this;

				if(this.attr('listData')) {
					this.attr('options', this.attr('listData'));
					dfd.resolve();
				}
				else if(this.attr('listSrc')) {
					can.ajax({
						url: this.attr('listSrc'),
						dataType: 'text',
						success: function(options) {
							self.attr('options', options);
							dfd.resolve();
						},
						error: function() {
							dfd.reject();
						}
					});
				}

				return dfd;
			}
		});

		exports.Field = Field;

	});

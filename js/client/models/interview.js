define(['can',
	'models/answers',
	'models/page',
	'util/parser',
	'exports',
	'can/map/define'],
	function(can, Answers, Page, parser, exports) {

		var Interview = can.Model.extend({
			findOne: function(data, success, error) {
				var dfd = new can.Deferred(),
				resumeDfd = new can.Deferred(),

				interviewDfd = can.ajax({
					url: data.url
				});

				interviewDfd.done(function(interview) {
					if(data.resume) {
						can.ajax({
							url: data.resume,
							dataType: 'text'
						})
						.done(function(anx) {
							var vars = parser.parseJSON(anx, interview.vars);
							interview.vars = vars;

							resumeDfd.resolve(interview);
						})
						.fail(function() {
							resumeDfd.reject();
						});
					}
					else {
						resumeDfd.resolve(interview);
					}
				});

				resumeDfd.done(function(interview) {
					dfd.resolve(interview);
				}).fail(function() {
					dfd.reject();
				});

				return dfd;
			},

			parseModel: function(data) {
				data._pages = data.pages;
				data.pages = [];

				can.each(data._pages, function(p) {
					var num = p.step,

					step = _.find(data.steps, function(step) {
						return +step.number === num;
					});

					p.step = step;

					data.pages.push(p);
				});

				can.each(data.vars, function(v) {
					v.values = v.values || [null];
				});

				return data;
			}
		}, {
			define: {
				pages: {
					set: function(list) {
						var self = this;

						var pages = new Page.Page.List(list.forEach(function(p) {
							p.interview = self;
						}));

						return pages;
					},
					Type: Page.Page.List
				},
				answers: {
					Type: Answers,
					Value: Answers
				}
			},

			createGuide: function() {
				var answers = this.attr('answers');

				return {
					pages: this._pages,
					varExists: can.proxy(answers.varExists, answers),
					varGet: can.proxy(answers.varGet, answers),
					varSet: can.proxy(answers.varSet, answers)
				};
			}
		});

		exports.Interview = Interview;

	});

define(['can',
		'models/answervm',
		'models/constants',
		'text!components/pages/init.stache',
		'util/helpers',
		'bootstrap',
		'components/pages/fields/fields',
		'can/view/stache'
	],

	function(can, AnswerVM, constants, init) {

		var PageVM = can.Map.extend({
			currentPage: null,

			_setPage: function(page, gotoPage) {
				var rState = this.attr('rState'),
				answer = this.attr('interview.answers.' + page.attr('repeatVar')),
				i = answer ? new AnswerVM({ answer: answer }).attr('values') : null;

				if(i) {
					rState.attr({
						page: gotoPage,
						i: +i
					});
				} else {
					rState.removeAttr('i');
					rState.attr('page', gotoPage);
				}
			},

			home: function() {
				this.attr('rState').attr({}, true);
			},

			navigate: function(button) {
				var fields = this.attr('currentPage.fields'),
				error = false;

				can.each(fields, function(field) {
					var errors = field.attr('_answer').errors();
					field.attr('hasError', !!errors);

					if(errors) error = true;
				});

				if(!error) {
					var logic = this.attr('logic');

					logic.exec(this.attr('currentPage.codeAfter'));

					var gotoPage = logic.attr('gotoPage');
					if(gotoPage && gotoPage.length) {
						logic.attr('gotoPage', null);

						this._setPage(this.attr('currentPage'), gotoPage);
					}
					else if(button.next === 'SUCCESS') {
						var completed = new AnswerVM({
							answer: this.attr('pState.answers.' + constants.vnInterviewIncompleteTF.toLowerCase())
						}),
						self = this;

						completed.attr('values', false);
						var dfd = this.attr('pState').save();
						dfd.done(function(url) {
							self.attr('mState').attr({
								redirect: url,
								header: '',
								step: ''
							});
							self.attr('rState').attr({ view: 'complete' }, true);
						});
					}
					else {
						this._setPage(this.attr('currentPage'), button.next);
					}
				}
			}
		});

		can.Component.extend({
			tag: 'a2j-pages',
			template: can.stache(init),
			scope: PageVM,
			helpers: {
				page: function(page, options) {
					page = typeof page === 'function' ? page() : page;

					if(page && page !== 'FAIL') {
						var p = this.attr('interview.pages').find(page),
						fields = p.attr('fields'),
						self = this;

						this.attr('mState.header', p.attr('step.text'));
						this.attr('mState.step', p.attr('step.number'));
						this.attr('currentPage', p);

						can.each(fields, function(field) {
							var avm = new AnswerVM({
								answer: field.attr('answer'),
								field: field
							});

							if(self.attr('rState.i')) {
								avm.attr('answerIndex', +self.attr('rState.i'));
							}

							if(field.attr('type') === 'textpick') {
								field.getOptions();
							}

							field.attr('_answer', avm);
						});

						return options.fn(this.attr('currentPage'));
					}
				}
			},
			events: {
				'a:regex(href,popup\://) click': function(el, ev) {
					ev.preventDefault();
					var p = this.scope.attr('interview.pages').find(el[0].pathname.replace('//', ''));
					this.scope.attr('popupPage', p);

					this.element.find('#pageModal').modal();
				},

				'{rState} page': function(rState, ev, val, old) {
					if(!val || val === 'FAIL') {
						var url = this.scope.attr('mState.exitURL');

						//TODO: This shouldn't be necessary, however something
						//else is being executed.
						setTimeout(function() {
							window.location = url;
						});

						return;
					}

					var p = this.scope.attr('interview.pages').find(val),
					logic = this.scope.attr('logic');

					logic.exec(p.attr('codeBefore'));
					var gotoPage = logic.attr('gotoPage');

					if(logic.attr('infinite').errors()) {
						this.scope.attr('rState.page', '__error');
					}
					else if(gotoPage && gotoPage.length) {
						logic.attr('infinite').inc();
						this.scope._setPage(p, gotoPage);
					}
					else {
						logic.attr('infinite').reset();
					}
				},

				'#pageModal hidden.bs.modal': function(el, ev) {
					this.scope.attr('popupPage', null);
				}
			}
		});

	});

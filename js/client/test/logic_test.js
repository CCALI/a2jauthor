define(['util/logic',
	'util/infinite',
	'models/interview',
	'models/answer',
	'models/answers',
	'models/answervm'],

function(Logic,
	Infinite,
	Interview,
	Answer,
	Answers,
	AnswerVM) {

	module('logic', {
		setup: function() {
			this.answers = new Answers();
			this.interview = new Interview.Interview({
				_pages: {
					'1-Introduction': {
						name: '1-Introduction',
						fields: [{
							name: 'firstname',
							type: 'text'
						}, {
							name: 'middlename',
							type: 'text'
						}, {
							name: 'lastname',
							type: 'text'
						}]
					},
					'1-job loss date': {
						name: '1-Introduction',
					}
				},
				pages: [{
					name: '1-Introduction',
					fields: [{
						name: 'firstname',
						type: 'text'
					}, {
						name: 'middlename',
						type: 'text'
					}, {
						name: 'lastname',
						type: 'text'
					}]
				}, {
					name: '1-Introduction',
					fields: []
				}],
				answers: this.answers
			});

			var avm = new AnswerVM({
				answer: this.interview.attr('pages.0.fields.0.answer')
			});
			avm.attr('values', 'John');

			avm = new AnswerVM({
				answer: this.interview.attr('pages.0.fields.2.answer')
			});
			avm.attr('values', 'Doe');

			this.logic = new Logic({
				interview: this.interview
			});
		}
	});

	test('simple set', function() {
		var logic = this.logic;
		logic.exec('set firstname to "Bob"');

		deepEqual(this.answers.serialize(), {
			'firstname': {
				name: 'firstname',
				type: 'text',
				values: [null, 'Bob']
			},
			'lastname': {
				name: 'lastname',
				type: 'text',
				values: [null, 'Doe']
			}
		}, 'values set');
	});

	test('conditional set w/ linebreaks', function() {
		var logic = this.logic;
		var str = 'if middlename = ""<BR/>'
			+ 'set fullname to firstname + " " + lastname<BR/>'
			+ 'else<BR/>'
			+ 'set fullname to firstname + " " + middlename + " " + lastname<BR/>'
			+ 'end if';

		var avm = new AnswerVM({
			answer: this.interview.attr('pages.0.fields.1.answer')
		});
		avm.attr('values', '');

		this.answers.attr('fullname', new Answer({
			name: 'fullname',
			type: 'text',
			repeating: false,
			values: [null]
		}));

		logic.exec(str);

		deepEqual(this.answers.serialize(), {
			'fullname': {
				name: 'fullname',
				repeating: false,
				type: 'text',
				values: [null, 'John Doe']
			},
			'firstname': {
				name: 'firstname',
				type: 'text',
				values: [null, 'John']
			},
			'lastname': {
				name: 'lastname',
				type: 'text',
				values: [null, 'Doe']
			},
			'middlename': {
				name: 'middlename',
				type: 'text',
				values: [null, '']
			}
		}, 'values set without extra whitespace');

		//setting middlename
		avm.attr('values', 'T');

		logic.exec(str);

		deepEqual(this.answers.serialize(), {
			'fullname': {
				name: 'fullname',
				repeating: false,
				type: 'text',
				values: [null, 'John T Doe']
			},
			'firstname': {
				name: 'firstname',
				type: 'text',
				values: [null, 'John']
			},
			'lastname': {
				name: 'lastname',
				type: 'text',
				values: [null, 'Doe']
			},
			'middlename': {
				name: 'middlename',
				type: 'text',
				values: [null, 'T']
			}
		}, 'middle name set');
	});

	test('simple goto', function() {
		var logic = this.logic;
		var codeBefore = 'GOTO "1-job loss date"';
		logic.exec(codeBefore);

		equal(logic.attr('gotoPage'), '1-job loss date', 'target page set');
	});

	test('conditional goto', function() {
		var logic = this.logic;
		var codeBefore = 'if firstname = "John"<BR/>'
			+ 'GOTO "1-job loss date"<BR/>'
			+ 'end if';
		logic.exec(codeBefore);

		equal(logic.attr('gotoPage'), '1-job loss date', 'target page set');
	});

	test('eval text', function() {
		var logic = this.logic;

		equal(logic.eval('%%1+1%%'), '2', 'simple eval');
		equal(logic.eval('%%firstname%%'), 'John', 'simple token interpolation');
		equal(logic.eval('%%firstname%% %%FIRSTname%%'), 'John John', 'multiple token interpolation w/ case');
	});

	module('infinite module');

	test('infinite errors', function() {
		var inf = new Infinite();

		for(var i = 0; i < 101; i++) {
			inf.inc();
		}

		ok(inf.errors(), 'range error');

		inf.reset();
		ok(!inf.errors(), 'errors cleared');
	});

});
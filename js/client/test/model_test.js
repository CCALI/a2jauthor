define(['models/interview',
	'models/answer',
	'models/answers',
	'models/answervm',
	'models/field',
	'models/page',
	'models/memoryState',
	'can/util/fixture'],

function(Interview, Answer, Answers, AnswerVM, Field, Page, MemoryState) {

	module('page');

	test('find', function() {
		var page = new Page.Page({
			name: '1-Introduction'
		}),
		pages = new Page.Page.List();

		pages.push(page);

		equal(pages.find('1-Introduction'), page, 'page found by name');
	});

	module('AnswerViewModel');

	test('serialize', function() {
		var answers = new Answers();
		var interview = new Interview.Interview({
			pages: [{
				fields: [{
					name: 'user gender',
					type: 'text'
				}]
			}, {
				fields: [{
					name: 'user gender',
					type: 'text'
				}]
			}],
			answers: answers
		});

		var answer = interview.attr('pages.0.fields.0.answer');

		var avm = new AnswerVM({
			answer: answer
		});

		avm.attr('values', 'm');
		deepEqual(answers.serialize(), {
			'user gender': {
				name: 'user gender',
				type: 'text',
				values: [null, 'm']
			}
		}, 'single value serialize');

		avm.attr('answerIndex', 2);
		avm.attr('values', 'f');

		deepEqual(answers.serialize(), {
			'user gender': {
				name: 'user gender',
				type: 'text',
				values: [null, 'm', 'f']
			}
		}, 'multiple values serialize');
	});

	module('interview');

	test('parseModels', function() {
		stop();

		can.fixture('GET /interview.json', function(req, res) {
			res(200, {
				pages: {
					'1-Introduction': {
						name: '1-Introduction',
						fields: [{
							name: 'user gender',
							type: 'text'
						}]
					}
				}
			});
		});

		Interview.Interview.findOne({ url: '/interview.json' }, function(interview) {
			deepEqual(interview.serialize(), {
				pages: [{
					fields: [{
						name: 'user gender',
						type: 'text',
						options: ''
					}],
					name: '1-Introduction'
				}],
				_pages: {
					'1-Introduction': {
						name: '1-Introduction',
						fields: [{
							name: 'user gender',
							type: 'text',
							options: ''
						}]
					}
				},
				answers: {}
			});

			start();
			can.fixture.overwrites = [];
		});
	});

	module('MemoryState');

	test('xml to json suffix', function() {
		var mState = new MemoryState({
			templateURL: 'foo.xml'
		});

		equal(mState.attr('templateURL'), 'foo.json', 'suffix is modified correctly');
		notEqual(mState.attr('templateURL'), 'foo.xml', 'suffix is modified incorrectly');
	});

});
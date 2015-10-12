require(['jquery',
		'can',
		'models/interview',
		'models/persistedState',
		'models/memoryState',
		'models/answers',
		'models/constants',
		'util/logic',
		'util/lang',

		'text!components/app/init.stache',

		'can/route',
		'can/view/stache',

		'components/screenManager/screenManager',
		'util/helpers',
		'jquerypp/dom/cookie',

		'fixtures/fixtures'
	],
	function($,
		can,
		Interview,
		PersistedState,
		MemoryState,
		Answers,
		constants,
		Logic,
		Lang,
		init) {

		/*
		State attrs not needing persistance, such as showing/hiding the table of contents.
		 */
		/* Load configuration from desktop into mobile */
		var mState = new MemoryState(can.deparam(window.location.search.substring(1)));

		/*
		AJAX request for interview json
		 */
		var iDfd = Interview.Interview.findOne({
			url: mState.attr('templateURL'),
			resume: mState.attr('getDataURL')
		}),

		/*
		Local storage request for any existing answers
		 */
		pDfd = PersistedState.findOne(),

		/*
		Route state
		 */
		rState = new can.Map();

		can.route('', { view: 'intro' });
		can.route('view/:view/page/:page');
		can.route('view/:view/page/:page/:i');
		can.route.map(rState);

		$.when(iDfd, pDfd).then(function(interview, pState) {
			can.route.ready();

			var lang = new Lang(interview.attr('language')),
			pState = pState || new PersistedState(),
			answers = pState.attr('answers');

			pState.attr('setDataURL', mState.attr('setDataURL'));
			pState.attr('autoSetDataURL', mState.attr('autoSetDataURL'));

			answers.attr(can.extend({}, interview.serialize().vars));
			answers.attr(constants.vnInterviewIncompleteTF.toLowerCase(), {
				name: constants.vnInterviewIncompleteTF.toLowerCase(),
				type: constants.vtTF,
				values: [null, true]
			});
			answers.attr('lang', lang);

			interview.attr('answers', answers);
			logic = new Logic({
				interview: interview
			});

			pState.backup();

			rState.bind('change', function(ev, attr, how, val, old) {
				if (attr === 'page' && val) {
					pState.attr('currentPage', val);
				}
			});

			$('body').append(can.stache(init)({
				rState: rState,
				pState: pState,
				mState: mState,
				interview: interview,
				logic: logic,
				lang: lang
			}));
		});

	});

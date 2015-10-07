require.config({

	baseUrl: '/client',

	map: {
		'*': {
			text: 'text'
		}
	},

	paths: {
		almond: 'lib/almond/almond',
		can: 'lib/canjs/amd/can',
		jquery: 'lib/jquery/dist/jquery',
		jquerypp: 'resources/jquerypp',
		localforage: 'lib/localforage/dist/localforage',
		lodash: 'lib/lodash/dist/lodash',
		bootstrap: 'lib/bootstrap/dist/js/bootstrap',
		moment: 'lib/momentjs/moment',
		text: 'lib/require-text/text'
	},

	shim: {
		jquery: {
			exports: 'jQuery'
		},

		bootstrap: {
			deps: ['jquery']
		}
	}

});

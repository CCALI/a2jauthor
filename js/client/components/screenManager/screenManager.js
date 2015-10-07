define(['jquery',
		'can',
		'text!components/screenManager/init.stache',

		'components/header/header',
		'components/intro/intro',
		'components/pages/pages',
		'components/footer/footer',

		'controls/filler/filler',
		'can/view/stache'
	],

	function($, can, init) {

		/*
		ScreenManager is to handle which view is currently on the screen. Also,
		if we add any animations on bringing views into the viewport, we'll add that here.
		 */
		can.Component.extend({
			tag: 'a2j-screen-manager',
			template: can.stache(init),
			scope: {
				hideCredits: function() {
					this.attr('mState.showCredits', false);
				}
			},
			helpers: {
				tocOrCreditsShown: function(options) {
					return this.attr('mState.showCredits') || this.attr('mState.showToc') ? options.fn() : options.inverse();
				},

				eval: function(str) {
					str = typeof str === 'function' ? str() : str;

					return this.attr('logic').eval(str);
				},

				i11n: function(key) {
					key = typeof key === 'function' ? key() : key;
					return this.attr('lang.' + key);
				}
			}
		});

	});

define(['can',
		'text!components/header/init.stache',
		'can/view/stache'
	],

	function(can, init) {

		can.Component.extend({
			tag: 'a2j-header',
			template: can.stache(init),
			scope: {
				toggleCredits: function() {
					this.attr('mState.showCredits', !this.attr('mState.showCredits'));
				},

				save: function() {
					this.attr('pState').save(true);
				}
			},
			helpers: {
				showSave: function(options) {
					var autoSetDataURL = this.attr('mState.autoSetDataURL');

					return this.attr('rState.view') === 'pages'
						&& autoSetDataURL && autoSetDataURL.length
						? options.fn()
						: options.inverse();
				}
			}
		});

	});

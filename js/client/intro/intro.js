define(['can',
		'text!components/intro/init.stache',
		'jquerypp/event/swipe',
		'can/view/stache'
	],

	function(can, init) {

		can.Component.extend({
			tag: 'a2j-intro',
			template: can.stache(init),
			scope: {
				navigate: function(button) {
					this.attr('rState').attr({
						page: this.attr('interview.firstPage'),
						view: 'pages'
					});
				}
			},
			events: {
				'inserted': function() {
					this.scope.attr('mState.header', '');
					this.scope.attr('mState.step', '');
				}
			}
		});

	});

define(['can',
		'text!components/pages/fields/init.stache',
		'components/pages/fields/field/field',
		'can/view/stache'
	],

	function(can, init) {

		can.Component.extend({
			tag: 'a2j-fields',
			template: can.stache(init)
		});

	});

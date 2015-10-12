define(['jquery',
	'can',
	'text!components/footer/init.stache',
	'can/view/stache',
	'jquerypp/dom/cookie'],
function($, can, init) {

	can.Component.extend({

		tag: 'a2j-footer',
		template: can.stache(init),
		scope: {
			showDesktop: function() {
				$.cookie('useDesktop', true, { expires: 1 });
				window.location = this.attr('mState.desktopURL')+
				// 2015-02-12 Ensure config passed back to desktop
				'?'+   $.param({
					templateURL: this.attr('mState.templateURL'),
					fileDataURL: this.attr('mState.fileDataURL'),
					getDataURL: this.attr('mState.getDataURL'),
					setDataURL: this.attr('mState.setDataURL'),
					autoSetDataURL: this.attr('mState.autoSetDataURL'),
					exitURL: this.attr('mState.exitURL'),
					logURL: this.attr('mState.logURL'),
					errRepURL: this.attr('mState.errRepURL')
					});
			}
		}

	});

});
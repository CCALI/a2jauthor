import Map from 'can/map/';
import Component from 'can/component/';
import template from './header.stache!';

let HeaderVM = Map.extend({
  toggleCredits: function() {
    this.attr('mState.showCredits', !this.attr('mState.showCredits'));
  },

  save: function() {
    this.attr('pState').save(true);
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-header',
  viewModel: HeaderVM,

  helpers: {
    showSave: function(options) {
      let autoSetDataURL = this.attr('mState.autoSetDataURL');

      return (this.attr('rState.view') === 'pages' &&
        autoSetDataURL && autoSetDataURL.length) ?
        options.fn() :
        options.inverse();
    }
  }
});

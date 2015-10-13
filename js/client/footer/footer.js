import $ from 'jquery';
import Map from 'can/map/';
import Component from 'can/component/';
import template from './footer.stache!';

import 'jquerypp/dom/cookie/';

let FooterVM = Map.extend({
  showDesktop: function() {
    $.cookie('useDesktop', true, {expires: 1});

    let qs = $.param({
      templateURL: this.attr('mState.templateURL'),
      fileDataURL: this.attr('mState.fileDataURL'),
      getDataURL: this.attr('mState.getDataURL'),
      setDataURL: this.attr('mState.setDataURL'),
      autoSetDataURL: this.attr('mState.autoSetDataURL'),
      exitURL: this.attr('mState.exitURL'),
      logURL: this.attr('mState.logURL'),
      errRepURL: this.attr('mState.errRepURL')
    });

    // 2015-02-12 Ensure config passed back to desktop
    // TODO: Figure out a better way to do this
    window.location = this.attr('mState.desktopURL') + '?' + qs;
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'a2j-footer',
  viewModel: FooterVM
});

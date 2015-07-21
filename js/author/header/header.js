import Map from 'can/map/';
import Component from 'can/component/';
import template from './header.stache!';
import helpPageUrl from 'author/utils/help-page-url';

import './header.less!';
import 'can/map/define/';

export let Header = Map.extend({
  define: {
    helpPageUrl: {
      get() {
        let page = this.attr('page');
        return helpPageUrl(page);
      }
    }
  }
});

export default Component.extend({
  template,
  leakScope: false,
  tag: 'app-header',
  viewModel: Header
});

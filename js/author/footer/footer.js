import Component from 'can/component/';
import template from './footer.stache!';
import Map from 'can/map/';
import constants from 'viewer/models/constants';
import moment from 'moment';

let FooterVM = Map.extend({
  define: {
    viewerVersion: {
      get() {
        return 'A2J ' + constants.A2JVersionNum + '-' + constants.A2JVersionDate;
      }
    },
    currentYear: {
      get() {
          return moment().year();
      }
    }
  }
});

export default Component.extend({
  template,
  viewModel: FooterVM,
  leakScope: false,
  tag: 'app-footer'
});

import AppMap from 'can-ssr/app-map';

import 'can/route/';
import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = AppMap.extend({
  define: {
    title: {
      serialize: false,
      value: 'A2J Test Assemble'
    }
  }
});

export default AppViewModel;

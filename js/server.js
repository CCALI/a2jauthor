import AppMap from 'can-ssr/app-map';

import 'can/route/';
import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = AppMap.extend({
  define: {
    message: {
      value: 'Hello World!',
      serialize: false
    },

    title: {
      value: 'donejs-chat',
      serialize: false
    }
  }
});

export default AppViewModel;

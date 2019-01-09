import CanMap from 'can-map'

import 'can-route'
import 'can-map-define'
import 'can-route-pushstate'

const Body = CanMap.extend({
  define: {
    templateIds: {
      type: '*'
    },
    fileDataUrl: {
      type: '*'
    }
  }
})

const Request = CanMap.extend({
  define: {
    body: {
      Type: Body
    }
  }
})

const AppViewModel = CanMap.extend('ServerAppViewModel', {
  define: {
    request: {
      Type: Request
    },

    title: {
      serialize: false,
      value: 'A2J Test Assemble'
    }
  }
})

export default AppViewModel

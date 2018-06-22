import Map from 'can/map/'

import 'can/route/'
import 'can/map/define/'
import 'can/route/pushstate/'

const AppViewModel = Map.extend({
  define: {
    title: {
      serialize: false,
      value: 'A2J Test Assemble'
    }
  }
})

export default AppViewModel

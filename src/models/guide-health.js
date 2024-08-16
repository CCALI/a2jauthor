import DefineMap from 'can-define/map/map'
import GuildHealthMessage from './guide-health-message'

export default DefineMap.extend('GuideHealthMessageModel', {
  // will be passed in
  currentGuide: {},

  isHealthy: {
    type: 'boolean',
    default: true
  },

  healthProblems: {
    Type: GuildHealthMessage,
    default: () => new GuildHealthMessage()
  },

  runHealthCheck () {
    console.log('checking health', this.currentGuide)
    // iterate over Guide, Step, Page, Field, Var
    // check field/var types
    // design for future health plugin checks - missing info, mismathes, typos, empty fields, etc
    // save problems in list w info (problem type, problem message, problem location, solution? )
    // clears problems as fixed
    // display in Reports tab with new HealthCheck section
    // display in QDE for individual field/var problems
    // be able to add messages to global list from any Author sub component/tab
  }
})

const loader = require('@loader')
const isWindow = loader.isPlatform('window')

// lodash requires `global` to be present otherwise it will failed silently
// in production https://github.com/CCALI/CAJA/issues/1058; this `configDependency`
// makes sure the variable is set to prevent runtime errors.
// TODO: Remove this once we add support to Steal to detect globals
if (isWindow) {
  window.global = window
}

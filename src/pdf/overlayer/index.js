const {validate} = require('./validate')
const {patch} = require('./patcher')

function applyOverlay (filepath, overlay) {
  return Promise.resolve()
    .then(() => patch(filepath, overlay))
}

const overlayer = {
  forkWithOverlay (filepath, overlay) {
    const validationError = validate(overlay)
    if (validationError) {
      return Promise.reject(validationError)
    }

    return applyOverlay(filepath, overlay)
  }
}

module.exports = {
  overlayer,
  testing: {
    applyOverlay
  }
}

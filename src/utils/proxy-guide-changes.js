// proxy app-state level `guide` map changes to global window.gGuide
const handler = (ev, newVal, oldVal) => {
  const guideAttr = ev.type
  window.gGuide[guideAttr] = newVal
}

export default (guide, mirrorProperties) => {
  // no guide loaded, return noop teardown handler
  if (!guide) { return () => {} }

  mirrorProperties.forEach((prop) => {
    // using the notify queue updates global gGuide instantly
    guide.listenTo(prop, handler, 'notify')
  })

  // return the tearDown function to call in `removed` event or `connectedCallback()` teardown function
  return () => {
    mirrorProperties.forEach((prop) => {
      // using the notify queue updates global gGuide instantly
      guide.stopListening(prop, handler, 'notify')
    })
  }
}

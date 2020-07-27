import $ from 'jquery'
import loader from '@loader'
import AppState from './models/app-state'
import tabsRouting from 'a2jauthor/utils/tabs-routing'
import viewerPreviewTpl from './viewer-preview-layout.stache'
import bindCustomEvents from 'a2jauthor/utils/bind-custom-events'

import stache from 'can-stache'
import route from 'can-route'
import '@caliorg/a2jdeps/calculator/jquery.plugin'
import '@caliorg/a2jdeps/calculator/jquery.calculator'
import '@caliorg/a2jdeps/calculator/jquery.calculator.css'
import 'bootstrap/js/dropdown.js'

import 'can-3-4-compat/dom-mutation-events'
import can from 'can-namespace'
window.can = can

const appState = new AppState()

route.data = appState
route.register('{page}', { page: 'interviews' })
route.register('{page}/{guideId}')
route.register('{page}/{action}/{guideId}-{templateId}')

route.start()

stache.registerPartial('viewer-preview-layout', viewerPreviewTpl)

$('body').on('click', 'a[href="#"]', ev => ev.preventDefault())

bindCustomEvents(appState)

// The legacy code in legacy/legacy requires the dom to be populated in order to work,
// so we first render the main app's template and then load the code.
let loadLegacyCode = function () {
  return loader.import('a2jauthor/legacy/')
}

let render = function ({ template }) {
  $('#author-app').html(template(appState))
}

loader.import('a2jauthor/app-template')
  .then(render)
  .then(loadLegacyCode)
  .then(() => tabsRouting(appState))

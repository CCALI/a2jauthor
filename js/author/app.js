import $ from 'jquery'
import loader from '@loader'
import AppState from './models/app-state'
import tabsRouting from 'caja/author/utils/tabs-routing'
import viewerPreviewTpl from './viewer-preview-layout.stache'
import bindCustomEvents from 'caja/author/utils/bind-custom-events'

import stache from 'can-stache'
import route from 'can-route'
import 'calculator/jquery.plugin'
import 'calculator/jquery.calculator'
import 'calculator/jquery.calculator.css'
import 'bootstrap/js/dropdown.js'

import can from 'can-namespace'
window.can = can

let appState = new AppState()

route.map(appState)
route(':page', {page: 'interviews'})
route(':page/:guideId')
route(':page/:action/:guideId-:templateId')

route.ready()
stache.registerPartial('viewer-preview-layout', viewerPreviewTpl)

$('body').on('click', 'a[href="#"]', ev => ev.preventDefault())

bindCustomEvents(appState)

// The legacy code in src/src requires the dom to be populated in order to work,
// so we first render the main app's template and then load the code.
let loadLegacyCode = function () {
  return loader.import('caja/author/src/')
}

let render = function ({template}) {
  $('#author-app').html(template(appState))
}

loader.import('caja/author/app-template')
  .then(render)
  .then(loadLegacyCode)
  .then(() => tabsRouting(appState))

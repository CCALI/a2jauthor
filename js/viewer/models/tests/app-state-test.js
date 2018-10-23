import { assert } from 'chai'
import AppState from 'caja/viewer/models/app-state'
import Interview from 'caja/viewer/models/interview'
import Infinite from 'caja/viewer/mobile/util/infinite'
import CanMap from 'can-map'
import sinon from 'sinon'

import 'steal-mocha'

describe('AppState', function () {
  let appState // DefineMap
  let pageNames
  let interview
  let answers
  let logic
  let appStateTeardown

  beforeEach(function (done) {
    let promise = Interview.findOne({url: '/interview.json'})

    promise.then(function (_interview) {
      interview = _interview
      answers = new CanMap()
      interview.attr('answers', answers)

      logic = new CanMap({
        infinite: new Infinite(),
        eval: sinon.spy(),
        exec: sinon.spy(),
        varGet: sinon.stub(),
        varSet: sinon.stub(),
        gotoPage: ''
      })

      appState = new AppState({interview, logic})
      // simulate stache bind on visitedPages
      appStateTeardown = appState.connectedCallback()

      // collect the actual page names of the interview
      const pages = interview.attr('pages')
      pageNames = pages.map(page => page.attr('name'))


      done()
    })
  })

  afterEach(function () {
    appStateTeardown()
  })

  it('defaults visitedPages to empty list', function () {
    const visitedPages = appState.visitedPages
    assert.equal(visitedPages.length, 0, 'empty on init')
  })

  it('keeps a list of visited pages', function () {
    assert.equal(appState.visitedPages.length, 0, 'empty on init')

    // simulate page to page navigation
    appState.page = pageNames[0]
    appState.page = pageNames[1]

    assert.equal(appState.visitedPages.length, 2, 'two pages visited')
  })

  it('handles repeatVarValues', function () {
    interview.attr('pages.1.repeatVar', 'childCount')
    logic.varGet.returns(1)
    appState.page = pageNames[1]

    assert.equal(appState.visitedPages.length, 1, 'appState.visitedPages should be correct length')
    assert.equal(appState.visitedPages[0].repeatVar, 'childCount', 'page has repeatVar')
    assert.equal(appState.visitedPages[0].repeatVarValue, '1', 'page has repeatVarValue')
  })

  it('handles following pages without repeatVarValues', function () {
    interview.attr('pages.1.repeatVar', 'childCount')
    logic.varGet.returns(1)
    appState.page = pageNames[1]

    assert.equal(appState.visitedPages.length, 1, 'appState.visitedPages should be correct length')
    assert.equal(appState.visitedPages[0].repeatVar, 'childCount', 'page has repeatVar')
    assert.equal(appState.visitedPages[0].repeatVarValue, '1', 'page has repeatVarValue')

    appState.page = pageNames[2]
    logic.varGet.returns(null)
    assert.equal(appState.visitedPages.length, 2, 'appState.visitedPages should be correct length')
    assert.equal(appState.visitedPages[0].repeatVar, '', 'page should not have repeatVar')
    assert.equal(appState.visitedPages[0].repeatVarValue, null, 'page has no repeatVarValue')
  })

  it('handles repeatVarValue changes with same page name', function () {
    interview.attr('pages.1.repeatVar', 'childCount')
    logic.varGet.returns(1)
    appState.page = pageNames[1]

    assert.equal(appState.visitedPages.length, 1, 'first page appState.visitedPages')
    assert.equal(appState.visitedPages[0].repeatVar, 'childCount', 'first page has repeatVar')
    assert.equal(appState.visitedPages[0].repeatVarValue, '1', 'first page has repeatVarValue')

    logic.varGet.returns(2)
    appState.page = pageNames[1]
    assert.equal(appState.visitedPages.length, 2, 'second page appState.visitedPages')
    assert.equal(appState.visitedPages[0].repeatVar, 'childCount', 'second page has repeatVar')
    assert.equal(appState.visitedPages[0].repeatVarValue, '2', 'second page has repeatVarValue')
  })

  it('pages with codeBefore goto logic should only add the target page to visitedPages instead', function () {
    // simulate logic changing gotoPage based on A2J codeBefore script
    logic.attr('gotoPage', pageNames[1])
    logic.exec = function () { logic.attr('gotoPage', pageNames[2]) }
    interview.attr('pages.0.codeBefore', 'a2j script is here, fired by logic.exec above to change gotoPage')

    appState.page = pageNames[0]

    assert.equal(appState.visitedPages.length, 1, 'should only have one visited page')
    assert.equal(appState.page, pageNames[2], 'page name should be set by codeBefore script')
  })

  it('sets the lastVisitedPageName to be used as a RESUME target', function () {
    let lastVisitedPageName = appState.lastVisitedPageName
    assert.equal(lastVisitedPageName, false, 'defaults to false')

    appState.page = pageNames[0]
    lastVisitedPageName = appState.lastVisitedPageName
    assert.equal(lastVisitedPageName, pageNames[0], 'updates lastVisitedPage when page changes')

    appState.page = pageNames[1]
    lastVisitedPageName = appState.lastVisitedPageName
    assert.equal(lastVisitedPageName, pageNames[1], 'lastVisitedPage stays up to date when page changes')
  })

  it('only includes known pages', function () {
    appState.page = 'this-page-does-not-exist'
    assert.equal(appState.visitedPages.length, 0, 'invalid page')
  })

  it('recently visited pages are at the top of the list', function () {
    appState.page = pageNames[0]
    appState.page = pageNames[1]
    appState.page = pageNames[2]

    assert.equal(appState.visitedPages.length, 3, 'three pages visited')

    assert.equal(appState.visitedPages.shift().name, pageNames[2])
    assert.equal(appState.visitedPages.shift().name, pageNames[1])
    assert.equal(appState.visitedPages.shift().name, pageNames[0])
  })

  it('Possible infinite loop', (done) => {
    appState.traceLogic.bind('change', function handler () {
      appState.traceLogic.unbind('change', handler)
      assert.deepEqual(appState.traceLogic.attr(), [{
        'infinite loop': {
          format: 'info',
          msg: 'Possible infinite loop. Too many page jumps without user interaction'
        }
      }], 'Possible infinite loop')
      done()
    })

    appState.logic.attr('infinite._counter', 501)
    appState.page = pageNames[0]
  })
})

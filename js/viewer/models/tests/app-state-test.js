import assert from 'assert'
import AppState from 'caja/viewer/models/app-state'
import Interview from 'caja/viewer/models/interview'
import sinon from 'sinon'

import 'steal-mocha'

describe('AppState', function () {
  let appState // DefineMap
  let pageNames
  let interview
  let logic

  beforeEach(function (done) {
    let promise = Interview.findOne({url: '/interview.json'})

    promise.then(function (_interview) {
      interview = _interview
      logic = {
        eval: sinon.spy(),
        varGet: sinon.stub()
      }

      appState = new AppState({interview, logic})

      // collect the actual page names of the interview
      let pages = interview.attr('pages')
      pageNames = pages.map(page => page.attr('name'))

      done()
    })
  })

  it('defaults visitedPages to empty list', function () {
    const visitedPages = appState.visitedPages
    assert.equal(visitedPages.length, 0, 'empty on init')
  })

  it('keeps a list of visited pages', function () {
    // simulate stache bind on visitedPages
    appState.listenTo('visitedPages', () => {})

    assert.equal(appState.visitedPages.length, 0, 'empty on init')

    // simulate page to page navigation
    appState.page = pageNames[0]
    appState.page = pageNames[1]

    assert.equal(appState.visitedPages.length, 2, 'two pages visited')
  })

  it('handles repeatVarValues', function () {
    // simulate stache bind on visitedPages
    appState.listenTo('visitedPages', () => {})

    interview.attr('pages.1.repeatVar', 'childCount')
    logic.varGet.returns(1)
    appState.page = pageNames[1]

    assert.equal(appState.visitedPages.length, 1, 'third page appState.visitedPages')
    assert.equal(appState.visitedPages[0].repeatVar, 'childCount', 'page has repeatVar')
    assert.equal(appState.visitedPages[0].repeatVarValue, '1', 'page has repeatVarValue')
  })

  it('handles repeatVarValue changes with same page name', function () {
    // simulate stache bind on visitedPages
    appState.listenTo('visitedPages', () => {})

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

  // it('handles restoring repeatVar values when revisiting a page', function () {
  //   // simulate stache bind on visitedPages
  //   appState.listenTo('visitedPages', () => {})

  //   interview.attr('pages.1.repeatVar', 'childCount')
  //   logic.varGet.returns(1)
  //   appState.page = pageNames[1]

  //   assert.equal(appState.visitedPages.length, 1, 'first page appState.visitedPages')
  //   assert.equal(appState.visitedPages[0].repeatVar, 'childCount', 'first page has repeatVar')
  //   assert.equal(appState.visitedPages[0].repeatVarValue, '1', 'first page has repeatVarValue')

  //   logic.varGet.returns(2)
  //   appState.page = pageNames[1]
  //   assert.equal(appState.visitedPages.length, 2, 'second page appState.visitedPages')
  //   assert.equal(appState.visitedPages[0].repeatVar, 'childCount', 'second page has repeatVar')
  //   assert.equal(appState.visitedPages[0].repeatVarValue, '2', 'second page has repeatVarValue')
  // })

  it('only includes known pages', function () {
    // simulate stache bind on visitedPages
    appState.listenTo('visitedPages', () => {})

    appState.page = 'this-page-does-not-exist'
    assert.equal(appState.visitedPages.length, 0, 'invalid page')
  })

  it('recently visited pages are at the top of the list', function () {
    // simulate stache bind on visitedPages
    appState.listenTo('visitedPages', () => {})

    appState.page = pageNames[0]
    appState.page = pageNames[1]
    appState.page = pageNames[2]

    assert.equal(appState.visitedPages.length, 3, 'three pages visited')

    assert.equal(appState.visitedPages.shift().name, pageNames[2])
    assert.equal(appState.visitedPages.shift().name, pageNames[1])
    assert.equal(appState.visitedPages.shift().name, pageNames[0])
  })

  it('visitedPages should not be empty when both page/interview are set', function () {
    // // set first page then interview
    // appState = new AppState({ logic })
    // // simulate stache bind on visitedPages
    // appState.listenTo('visitedPages', () => {})
    // appState.page = pageNames[0]
    // appState.interview = interview

    // assert.equal(appState.visitedPages.length, 1, 'should include first page name')
    // assert.equal(appState.visitedPages[0].name, pageNames[0])

    // set first interview then page.
    appState = new AppState({ logic })
    // simulate stache bind on visitedPages
    appState.listenTo('visitedPages', () => {})
    appState.interview = interview
    appState.page = pageNames[0]

    assert.equal(appState.visitedPages.length, 1, 'should include first page name')
    assert.equal(appState.visitedPages[0].name, pageNames[0])
  })
})

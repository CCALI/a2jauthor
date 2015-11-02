import assert from 'assert';
import AppState from 'viewer/models/app-state';
import Interview from 'viewer/models/interview';

import 'steal-mocha';

describe('AppState', function() {
  let appState;
  let pageNames;
  let interview;

  beforeEach(function(done) {
    let promise = Interview.findOne({url: '/interview.json'});

    promise.then(function(_interview) {
      interview = _interview;
      appState = new AppState({interview});

      // collect the actual page names of the interview
      let pages = interview.attr('pages');
      pageNames = pages.map(page => page.attr('name'));

      done();
    });
  });

  it('defaults visitedPages to empty list', function() {
    let visited = appState.attr('visitedPages');
    assert.equal(visited.attr('length'), 0, 'empty on init');
  });

  it('keeps a list of visited pages', function() {
    let visited = appState.attr('visitedPages');
    assert.equal(visited.attr('length'), 0, 'empty on init');

    // simulate page to page navigation
    appState.attr('page', pageNames[0]);
    appState.attr('page', pageNames[1]);

    assert.equal(visited.attr('length'), 2, 'two pages visited');
  });

  it('does not include pages already visited', function() {
    let visited = appState.attr('visitedPages');

    appState.attr('page', pageNames[0]);
    appState.attr('page', pageNames[1]);
    assert.equal(visited.attr('length'), 2, 'two pages visited');

    // user goes back from the second page to the first
    appState.attr('page', pageNames[1]);
    assert.equal(visited.attr('length'), 2, 'second page already visited');
  });

  it('only includes known pages', function() {
    let visited = appState.attr('visitedPages');

    appState.attr('page', 'this-page-does-not-exist');
    assert.equal(visited.attr('length'), 0, 'invalid page');
  });

  it('recently visited pages are at the top of the list', function() {
    let visited = appState.attr('visitedPages');

    appState.attr('page', pageNames[0]);
    appState.attr('page', pageNames[1]);
    appState.attr('page', pageNames[2]);
    assert.equal(visited.attr('length'), 3, 'three pages visited');

    assert.equal(visited.shift().attr('name'), pageNames[2]);
    assert.equal(visited.shift().attr('name'), pageNames[1]);
    assert.equal(visited.shift().attr('name'), pageNames[0]);
  });

  it('visitedPages should not be empty when both page/interview are set', function() {
    let visited;

    // set first page then interview
    appState = new AppState();
    appState.attr('page', pageNames[0]);
    appState.attr('interview', interview);

    visited = appState.attr('visitedPages');
    assert.equal(visited.attr('length'), 1, 'should include first page name');
    assert.equal(visited.attr('0.name'), pageNames[0]);

    // set first interview then page.
    appState = new AppState();
    appState.attr('interview', interview);
    appState.attr('page', pageNames[0]);

    visited = appState.attr('visitedPages');
    assert.equal(visited.attr('length'), 1, 'should include first page name');
    assert.equal(visited.attr('0.name'), pageNames[0]);
  });

});

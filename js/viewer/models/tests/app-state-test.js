import assert from 'assert';
import AppState from 'viewer/models/app-state';

import 'steal-mocha';

describe('AppState', function() {
  let appState;

  beforeEach(function() {
    appState = new AppState();
  });

  it('defaults visitedPages to empty list', function() {
    let visited = appState.attr('visitedPages');
    assert.equal(visited.attr('length'), 0, 'empty on init');
  });

});

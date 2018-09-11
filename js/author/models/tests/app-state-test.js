import { assert } from 'chai';
import AppState from 'caja/author/models/app-state';

import 'steal-mocha';

describe('AppState', function() {
  let appState;

  beforeEach(function() {
    appState = new AppState();
  });

  it('showDebugPanel - whether to show variables/trace panel', function() {
    assert.isFalse(appState.attr('showDebugPanel'), 'default value');

    appState.attr('page', 'interviews');
    appState.attr('showDebugPanel', true);
    assert.isFalse(appState.attr('showDebugPanel'),
      'can\'t be true since the panel should only be visible in preview tab');

    appState.attr('page', 'preview');
    appState.attr('showDebugPanel', true);
    assert.isTrue(appState.attr('showDebugPanel'), 'should be true ');
  });
});

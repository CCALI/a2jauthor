import assert from 'assert';
import Logic from 'viewer/mobile/util/logic';

import 'steal-mocha';

describe('infinite module', function() {

  it('infinite errors', function() {
    let inf = new Infinite();

    for (let i = 0; i < 101; i++) {
      inf.inc();
    }

    assert.ok(inf.errors(), 'range error');

    inf.reset();
    assert.ok(!inf.errors(), 'errors cleared');
  });

});

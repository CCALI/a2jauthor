import assert from 'assert';
import Lang from 'client/util/lang';

import 'steal-mocha';

describe('Lang', function() {

  it('english default setup', function() {
    var lang = new Lang();
    assert.equal(lang.attr('Continue'), 'Continue', 'lang map setup correctly');
  });

  it('korean setup', function() {
    var lang = new Lang('ko');
    assert.equal(lang.attr('Continue'), '계속', 'lang map setup correctly');
  });

});

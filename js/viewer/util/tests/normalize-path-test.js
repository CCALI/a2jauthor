import assert from 'assert';
import normalizePath from '../normalize-path';

import 'steal-mocha';

describe('normalizePath', function() {
  const pathToGuide = '/userfiles/user/guide';

  it('throws with invalid parameters', function() {
    assert.throws(() => normalizePath(), /Invalid parameters/);
    assert.throws(() => normalizePath('foo', null), /Invalid parameters/);
    assert.throws(() => normalizePath(null, 'foo'), /Invalid parameters/);
  });

  it('keeps urls', function() {
    let url = 'http://some/folder/file.xxx';
    assert.equal(normalizePath(pathToGuide, url), url);
  });

  it('replaces the file path with path provided as first argument', function() {
    let path = 'C:\\Users\\dev\\Documents\\logo.jpg';
    assert.equal(normalizePath(pathToGuide, path), '/userfiles/user/guide/logo.jpg');

    path = '/Users/dev/Sites/file.xml';
    assert.equal(normalizePath(pathToGuide, path), '/userfiles/user/guide/file.xml');
  });
});

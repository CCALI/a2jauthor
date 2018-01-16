const assert = require('assert')
const filenamify = require('../../src/util/pdf-filename')

describe('lib/util/pdf-filename', function () {
  it('returns default name if param not provided', function () {
    assert.equal(filenamify(), 'document.pdf', 'should default to document.pdf')
  })

  it('returns a kebab case version of param provided', function () {
    const title = 'My Awesome Interview'
    assert.equal(filenamify(title), 'my-awesome-interview.pdf')
  })

  it('removes invalid filename chars', function () {
    assert.equal(filenamify('foo//bar'), 'foo-bar.pdf')
    assert.equal(filenamify('<:foo//bar?*>'), 'foo-bar.pdf')
  })
})

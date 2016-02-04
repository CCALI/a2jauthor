var assert = require('assert');
var sinon = require('sinon');

var forwardCookies = require('../../src/util/cookies').forwardCookies;

var debug = require('debug')('A2J:tests');

describe('lib/util/cookies', function() {
  it('forwardCookies', function() {
    let nextSpy = sinon.spy();
    let req = {
      headers: {
        cookie: 'cookieOne=1; cookieTwo=2;'
      },
      feathers: {}
    };

    forwardCookies(req, null, nextSpy);

    assert.equal(req.feathers.cookies, req.cookies, 'should add cookies to req.feathers');
    assert(nextSpy.calledOnce, 'should call next middleware');
  });
});
